import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useContext } from 'react'
import { Text } from '../ui/text'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/layout'
import { VerificationRings } from './VerificationRings'
import { ShareLinkButton } from './ShareLinkButton'
import { ProgressBars } from './ProgressBars'

interface StoreHeaderProps {
  storeName: string
  bannerUrl?: string
  profileImage?: any
  profileInitials: string
  level: number
  currentXP: number
  xpToNextLevel: number
  salesCount: number
  shareableLink: string
  onEditPress?: () => void
}

export function StoreHeader({
  storeName,
  bannerUrl,
  profileImage,
  profileInitials,
  level,
  currentXP,
  xpToNextLevel,
  salesCount,
  shareableLink,
  onEditPress,
}: StoreHeaderProps) {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)

  return (
    <View style={styles.container}>
      {/* Banner Section */}
      <View style={styles.bannerContainer}>
        {bannerUrl ? (
          <Image
            source={{ uri: bannerUrl }}
            style={styles.banner}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.bannerPlaceholder}>
            <Text style={styles.bannerPlaceholderText}>Store Banner</Text>
          </View>
        )}
      </View>

      {/* Profile and Info Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileContainer}>
          <View style={styles.profileWrapper}>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={onEditPress}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image
                  source={profileImage}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileInitialsContainer}>
                  <Text style={styles.profileInitialsText}>{profileInitials}</Text>
                </View>
              )}
            </TouchableOpacity>
            <VerificationRings salesCount={salesCount} size={100} />
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.storeNameRow}>
            <Text style={styles.storeName}>{storeName}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv {level}</Text>
            </View>
          </View>

          <ProgressBars
            level={level}
            currentXP={currentXP}
            xpToNextLevel={xpToNextLevel}
            showVertical={false}
            profileImage={profileImage}
          />

          <View style={styles.shareButtonContainer}>
            <ShareLinkButton storeLink={shareableLink} />
          </View>
        </View>
      </View>
    </View>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.sectionGap,
  },
  bannerContainer: {
    width: '100%',
    height: 160,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.cardBackground || '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  bannerPlaceholderText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.containerPadding,
  },
  profileContainer: {
    marginRight: SPACING.md,
  },
  profileWrapper: {
    position: 'relative',
    width: 108,
    height: 108,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: theme.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInitialsContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitialsText: {
    color: theme.backgroundColor,
    fontFamily: theme.boldFont,
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '600',
  },
  infoSection: {
    flex: 1,
  },
  storeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  storeName: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: theme.boldFont,
    color: theme.textColor,
    fontWeight: '600',
    marginRight: SPACING.sm,
    letterSpacing: -0.3,
  },
  levelBadge: {
    backgroundColor: theme.tintColor || '#73EC8B',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  levelText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.boldFont,
    color: '#000000',
    fontWeight: '600',
  },
  shareButtonContainer: {
    marginTop: SPACING.md,
  },
})
