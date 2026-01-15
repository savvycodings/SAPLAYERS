import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useContext, useState } from 'react'
import { Text } from '../ui/text'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/layout'

interface PortfolioStats {
  cards: number
  sealed: number
  slabs: number
  total: number
}

interface ProfileHeaderProps {
  userName?: string
  isPremium?: boolean
  portfolioValue?: string
  stats?: PortfolioStats
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
  onEditPress,
}: ProfileHeaderProps) {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)
  const [isHovering, setIsHovering] = useState(false)

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
          <Text style={styles.portfolioValue}>{portfolioValue}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingTop: SPACING['4xl'],
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.containerPadding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
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
