import { View, StyleSheet, TouchableOpacity, Dimensions, LayoutChangeEvent, PanResponder } from 'react-native'
import { useContext, useState, useMemo, useRef } from 'react'
import { Text } from '../ui/text'
import Ionicons from '@expo/vector-icons/Ionicons'
import Svg, { Circle, Path, Line } from 'react-native-svg'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/layout'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface PortfolioStats {
  cards: number
  sealed: number
  slabs: number
  total: number
}

interface GraphDataPoint {
  x: number
  y: number
}

interface ProfileHeaderProps {
  userName?: string
  isPremium?: boolean
  portfolioValue?: string
  stats?: PortfolioStats
  portfolioData?: GraphDataPoint[]
  onEditPress?: () => void
}

export function ProfileHeader({
  userName = 'Kyle',
  isPremium = true,
  portfolioValue = '$67',
  stats = {
    cards: 188,
    sealed: 2,
    slabs: 0,
    total: 190,
  },
  portfolioData = [
    { x: 0, y: 45 },
    { x: 1, y: 52 },
    { x: 2, y: 48 },
    { x: 3, y: 55 },
    { x: 4, y: 62 },
    { x: 5, y: 58 },
    { x: 6, y: 67 },
  ],
  onEditPress,
}: ProfileHeaderProps) {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)
  const [isHovering, setIsHovering] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('1M')
  const [chartWidth, setChartWidth] = useState(SCREEN_WIDTH - (SPACING.containerPadding * 2))
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; value: number; index: number } | null>(null)
  const chartContainerRef = useRef<View>(null)

  // Generate data based on selected period - charts connect smoothly
  const chartData = useMemo(() => {
    // Base 1M data (30 days) - this is our foundation
    const oneMonthData = [45, 46, 48, 47, 49, 51, 50, 52, 54, 53, 55, 57, 56, 58, 60, 59, 61, 63, 62, 64, 66, 65, 67, 69, 68, 70, 72, 71, 73, 67]
    
    let values: number[] = []

    if (selectedPeriod === '1M') {
      // Last 30 days - realistic growth with natural fluctuations
      values = oneMonthData
    } else if (selectedPeriod === '3M') {
      // Last 90 days - simplified to ~30 points (20 historical + last 10 of 1M)
      // Historical data leading up to the 1M period (smooth, fewer points)
      const historical3M = [42, 43, 44, 43, 45, 44, 46, 45, 47, 46, 48, 47, 49, 48, 50, 49, 51, 50, 52, 45]
      // Last 10 points from 1M to connect smoothly
      const last1M = oneMonthData.slice(-10)
      values = [...historical3M, ...last1M]
    } else if (selectedPeriod === '6M') {
      // Last 180 days - simplified to ~30 points (20 historical + last 10 of 3M)
      // Historical data from 6M ago (smooth, fewer points)
      const historical6M = [38, 39, 40, 39, 41, 40, 42, 41, 43, 42, 44, 43, 45, 44, 46, 45, 47, 46, 48, 45]
      // Last 10 points from 3M to connect smoothly (which includes 1M end)
      const historical3M = [42, 43, 44, 43, 45, 44, 46, 45, 47, 46, 48, 47, 49, 48, 50, 49, 51, 50, 52, 45]
      const last1M = oneMonthData.slice(-10)
      const last3M = [...historical3M.slice(-10), ...last1M]
      values = [...historical6M, ...last3M]
    } else {
      // Last 365 days - simplified to ~30 points (20 historical + last 10 of 3M)
      // Historical data from 1Y ago (smooth, fewer points)
      const historical1Y = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54]
      // Last 10 points from 3M to connect smoothly (which includes 1M end)
      const historical3M = [42, 43, 44, 43, 45, 44, 46, 45, 47, 46, 48, 47, 49, 48, 50, 49, 51, 50, 52, 45]
      const last1M = oneMonthData.slice(-10)
      const last3M = [...historical3M.slice(-10), ...last1M]
      values = [...historical1Y, ...last3M]
    }

    return values.map((value, index) => ({ x: index, y: value }))
  }, [selectedPeriod])

  // Chart calculations - professional TradingView style
  const chartHeight = 200
  const yAxisWidth = 30 // Narrower Y-axis labels
  const chartPaddingRight = 0 // Minimal padding - extend to edge
  const chartPaddingTop = 20
  const chartPaddingBottom = 35
  // SVG width is chartWidth minus Y-axis width
  const svgWidth = Math.max(0, chartWidth - yAxisWidth)
  // Graph width is SVG width minus right padding (minimal)
  const graphWidth = Math.max(0, svgWidth - chartPaddingRight)
  const graphHeight = Math.max(0, chartHeight - chartPaddingTop - chartPaddingBottom)

  // Calculate chart values and grid
  const chartValues = chartData.map(d => d.y)
  const minValue = Math.min(...chartValues)
  const maxValue = Math.max(...chartValues)
  const padding = (maxValue - minValue) * 0.1 || 2
  const chartMin = Math.max(0, minValue - padding)
  const chartMax = maxValue + padding
  const valueRange = chartMax - chartMin || 1

  // Generate grid lines and Y-axis labels
  const gridCount = 5
  const gridStep = valueRange / (gridCount - 1)
  const gridLines = Array.from({ length: gridCount }, (_, i) => {
    const value = chartMin + gridStep * i
    const y = chartHeight - chartPaddingBottom - ((value - chartMin) / valueRange) * graphHeight
    return { y, value }
  })

  // Normalize chart points - coordinates relative to SVG (start at x=0)
  const normalizedPoints = chartData.map((point, index) => ({
    x: (index / (chartData.length - 1 || 1)) * graphWidth,
    y: chartHeight - chartPaddingBottom - ((point.y - chartMin) / valueRange) * graphHeight,
    value: point.y,
    index,
  }))

  // Create SVG path
  const chartPathData = normalizedPoints.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`
    }
    return `${path} L ${point.x} ${point.y}`
  }, '')

  const latestValue = chartData[chartData.length - 1]?.y || 0
  const previousValue = chartData[chartData.length - 2]?.y || 0
  const change = latestValue - previousValue
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : '0.0'

  const handleChartLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setChartWidth(width)
  }

  // Format date based on period and index
  const formatDate = (index: number, total: number, period: '1M' | '3M' | '6M' | '1Y') => {
    const now = new Date()
    let date = new Date(now)
    
    if (period === '1M') {
      date.setDate(now.getDate() - (total - 1 - index))
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (period === '3M') {
      date.setDate(now.getDate() - (90 - Math.floor((90 / (total - 1)) * index)))
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (period === '6M') {
      date.setDate(now.getDate() - (180 - Math.floor((180 / (total - 1)) * index)))
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      date.setDate(now.getDate() - (365 - Math.floor((365 / (total - 1)) * index)))
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  // Pan responder for chart interaction
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleTouch(evt.nativeEvent.locationX)
      },
      onPanResponderMove: (evt) => {
        handleTouch(evt.nativeEvent.locationX)
      },
      onPanResponderRelease: () => {
        // Keep showing the last touched point
      },
    })
  ).current

  const handleTouch = (x: number) => {
    // Adjust x for Y-axis width
    const chartX = x - yAxisWidth
    if (chartX < 0 || chartX > graphWidth) {
      setSelectedPoint(null)
      return
    }

    // Find closest point
    const closestPoint = normalizedPoints.reduce((prev, curr, index) => {
      const prevDist = Math.abs(prev.x - chartX)
      const currDist = Math.abs(curr.x - chartX)
      return currDist < prevDist ? { ...curr, index } : { ...prev, index: prev.index }
    }, { ...normalizedPoints[0], index: 0 })

    setSelectedPoint({
      x: closestPoint.x,
      value: closestPoint.value,
      index: closestPoint.index,
    })
  }

  const initials = userName
    ? userName
        .split(' ')
        .filter(n => n.length > 0)
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    : 'U'

  return (
    <View style={styles.container}>
      {/* Integrated Header with Stats */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Portfolio Overview</Text>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.profileIcon}
            activeOpacity={0.8}
            onPress={onEditPress}
            onPressIn={() => setIsHovering(true)}
            onPressOut={() => setIsHovering(false)}
          >
            <Text style={styles.profileInitials}>{initials}</Text>
            {isHovering && (
              <View style={styles.editIconContainer}>
                <Ionicons
                  name="pencil"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* User Name - Prominent */}
        <Text style={styles.userNameLarge}>{userName}</Text>

        {/* Portfolio Value - Prominent */}
        <View style={styles.portfolioValueSection}>
          <Text style={styles.portfolioLabel}>Portfolio Value</Text>
          <View style={styles.portfolioValueRow}>
            <Text style={styles.portfolioValue}>{portfolioValue}</Text>
            {change !== 0 && (
              <View style={[styles.changeBadge, change >= 0 ? styles.changePositive : styles.changeNegative]}>
                <Ionicons
                  name={change >= 0 ? 'arrow-up' : 'arrow-down'}
                  size={10}
                  color={change >= 0 ? '#10B981' : '#EF4444'}
                />
                <Text style={[styles.changeText, change >= 0 ? styles.changeTextPositive : styles.changeTextNegative]}>
                  {Math.abs(parseFloat(changePercent))}%
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Portfolio Growth Chart - Professional TradingView style */}
        {chartData && chartData.length > 0 && chartPathData && (
          <View style={styles.chartSection} onLayout={handleChartLayout}>
            <View style={styles.chartWrapper}>
              {/* Y-axis labels - highest at top */}
              <View style={styles.yAxisContainer}>
                {[...gridLines].reverse().map((grid, index) => (
                  <Text key={index} style={styles.yAxisLabel}>
                    ${grid.value.toFixed(0)}
                  </Text>
                ))}
              </View>

              {/* Chart SVG - Professional financial chart style */}
              <View 
                style={styles.chartSvgContainer}
                ref={chartContainerRef}
                {...panResponder.panHandlers}
              >
                <Svg width={svgWidth} height={chartHeight}>
                  {/* Grid lines - professional and visible */}
                  {gridLines.map((grid, index) => {
                    const isBottomLine = index === 0
                    return (
                      <Line
                        key={index}
                        x1={0}
                        y1={grid.y}
                        x2={graphWidth}
                        y2={grid.y}
                        stroke={isBottomLine ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)'}
                        strokeWidth={1}
                      />
                    )
                  })}

                  {/* Filled area - subtle gradient */}
                  <Path
                    d={`${chartPathData} L ${normalizedPoints[normalizedPoints.length - 1].x} ${chartHeight - chartPaddingBottom} L ${normalizedPoints[0].x} ${chartHeight - chartPaddingBottom} Z`}
                    fill={theme.tintColor || '#73EC8B'}
                    fillOpacity={0.1}
                  />

                  {/* Main chart line - sharp and professional */}
                  <Path
                    d={chartPathData}
                    stroke={theme.tintColor || '#73EC8B'}
                    strokeWidth={2.5}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Vertical crosshair line when touching */}
                  {selectedPoint && (
                    <Line
                      x1={selectedPoint.x}
                      y1={chartPaddingTop}
                      x2={selectedPoint.x}
                      y2={chartHeight - chartPaddingBottom}
                      stroke={theme.tintColor || '#73EC8B'}
                      strokeWidth={1}
                      strokeOpacity={0.5}
                      strokeDasharray="4,4"
                    />
                  )}

                  {/* Data point circle when touching */}
                  {selectedPoint && normalizedPoints[selectedPoint.index] && (
                    <Circle
                      cx={selectedPoint.x}
                      cy={normalizedPoints[selectedPoint.index].y}
                      r={4}
                      fill={theme.tintColor || '#73EC8B'}
                      stroke="#000"
                      strokeWidth={1}
                    />
                  )}
                </Svg>

                {/* Tooltip - positioned at top left of chart */}
                {selectedPoint && (
                  <View style={[styles.tooltip, { left: Math.max(0, Math.min(selectedPoint.x - 40, svgWidth - 100)) }]}>
                    <Text style={styles.tooltipDate}>
                      {formatDate(selectedPoint.index, chartData.length, selectedPeriod)}
                    </Text>
                    <Text style={styles.tooltipPrice}>
                      ${selectedPoint.value.toFixed(0)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Time Period Filters - Professional segmented control */}
        <View style={styles.periodSelectorContainer}>
          <View style={styles.periodSelector}>
            {(['1M', '3M', '6M', '1Y'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodOption,
                  selectedPeriod === period && styles.periodOptionActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.periodOptionText,
                    selectedPeriod === period && styles.periodOptionTextActive,
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats Grid - Integrated */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.cards}</Text>
            <Text style={styles.statLabel}>Cards</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.sealed}</Text>
            <Text style={styles.statLabel}>Sealed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.slabs}</Text>
            <Text style={styles.statLabel}>Slabs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

      </View>
    </View>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
  },
  headerSection: {
    backgroundColor: theme.backgroundColor,
    paddingTop: SPACING['4xl'],
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.containerPadding,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: theme.semiBoldFont,
    color: theme.textColor,
    fontWeight: '600',
    marginRight: SPACING.sm,
    letterSpacing: -0.2,
  },
  premiumBadge: {
    backgroundColor: theme.buttonBackground || 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  premiumText: {
    color: theme.textColor,
    fontFamily: theme.semiBoldFont,
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: theme.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  profileInitials: {
    color: theme.backgroundColor,
    fontFamily: theme.boldFont,
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
  },
  editIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portfolioValueSection: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  portfolioValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs / 2,
  },
  portfolioLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: SPACING.xs / 2,
    letterSpacing: 0.3,
  },
  portfolioValue: {
    fontSize: TYPOGRAPHY.h1 * 1.5,
    fontFamily: theme.boldFont,
    color: theme.tintColor || '#73EC8B',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  periodSelectorContainer: {
    width: '100%',
    marginBottom: SPACING.lg,
    marginTop: -SPACING['2xl'],
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: RADIUS.md,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 4,
  },
  periodOption: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodOptionActive: {
    backgroundColor: theme.textColor,
  },
  periodOptionText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.semiBoldFont,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  periodOptionTextActive: {
    color: theme.backgroundColor,
  },
  chartSection: {
    width: '100%',
    marginBottom: 0,
    paddingVertical: SPACING.sm,
    paddingBottom: 0,
  },
  chartWrapper: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
  },
  yAxisContainer: {
    width: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 35,
    paddingRight: 2,
    paddingLeft: 0,
    height: 200,
  },
  yAxisLabel: {
    fontSize: 11,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'left',
  },
  chartSvgContainer: {
    flex: 1,
    height: 200,
    overflow: 'visible',
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 80,
    alignItems: 'center',
  },
  tooltipDate: {
    fontSize: 10,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  tooltipPrice: {
    fontSize: 12,
    fontFamily: theme.semiBoldFont,
    color: theme.tintColor || '#73EC8B',
    fontWeight: '600',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.sm,
    gap: 2,
  },
  changePositive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  changeNegative: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  changeText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.semiBoldFont,
    fontWeight: '600',
  },
  changeTextPositive: {
    color: '#10B981',
  },
  changeTextNegative: {
    color: '#EF4444',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingTop: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: theme.boldFont,
    color: theme.textColor,
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
    letterSpacing: -0.2,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.2,
  },
  userNameLarge: {
    fontSize: TYPOGRAPHY.h1 * 1.2,
    fontFamily: theme.boldFont,
    color: theme.textColor,
    fontWeight: '700',
    marginTop: -SPACING.xs,
    marginBottom: SPACING.sm,
    letterSpacing: -0.3,
  },
})
