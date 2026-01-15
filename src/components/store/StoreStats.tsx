import { View, StyleSheet } from 'react-native'
import { useContext } from 'react'
import { Text } from '../ui/text'
import { Card, CardContent } from '../ui/card'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/layout'

interface StoreStatsProps {
  totalSales: number
  totalRevenue: number
  responseTime?: string
  reviewPercentage?: number
}

export function StoreStats({
  totalSales,
  totalRevenue,
  responseTime = 'N/A',
  reviewPercentage = 100,
}: StoreStatsProps) {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)

  return (
    <Card style={styles.statsCard}>
      <CardContent style={styles.statsContent}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalSales}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.revenueValue}>${totalRevenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{responseTime}</Text>
            <Text style={styles.statLabel}>Response</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviewPercentage}%</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: SPACING.md,
  },
  statsContent: {
    padding: SPACING.cardPadding,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '25%',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: theme.boldFont,
    color: theme.textColor,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  revenueValue: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: theme.boldFont,
    color: theme.tintColor || '#73EC8B',
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
})
