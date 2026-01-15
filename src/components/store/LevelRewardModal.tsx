import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { useContext } from 'react'
import { Text } from '../ui/text'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS, STORE_COLORS } from '../../constants/layout'

interface LevelRewardModalProps {
  visible: boolean
  level: number
  onClose: () => void
}

interface Benefit {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
}

function getLevelRewards(level: number) {
  if (level === 4) {
    return {
      title: 'Level 4 - Gold Tier',
      ringColor: STORE_COLORS.gold,
      ringName: 'Gold Ring',
      benefits: [
        {
          icon: 'storefront-outline' as const,
          title: 'Enhanced Store Visibility',
          description: 'Your store appears higher in search results and featured sections',
        },
        {
          icon: 'trending-up-outline' as const,
          title: 'Advanced Analytics Dashboard',
          description: 'Access detailed insights on sales, customer behavior, and trends',
        },
        {
          icon: 'images-outline' as const,
          title: 'Unlimited Product Listings',
          description: 'List as many products as you want without restrictions',
        },
        {
          icon: 'gift-outline' as const,
          title: 'Exclusive Promotional Tools',
          description: 'Create flash sales, bundle deals, and featured promotions',
        },
        {
          icon: 'people-outline' as const,
          title: 'Customer Loyalty Program',
          description: 'Reward repeat customers with points and special discounts',
        },
        {
          icon: 'shield-checkmark-outline' as const,
          title: 'Priority Support',
          description: 'Faster response times and dedicated support for store issues',
        },
      ],
    }
  } else if (level === 5) {
    return {
      title: 'Level 5 - Platinum Tier',
      ringColor: STORE_COLORS.platinum,
      ringName: 'Platinum Ring',
      benefits: [
        {
          icon: 'rocket-outline' as const,
          title: 'Featured Store Placement',
          description: 'Top placement in verified stores carousel and homepage',
        },
        {
          icon: 'cash-outline' as const,
          title: 'Reduced Platform Fees',
          description: 'Lower transaction fees to maximize your profits',
        },
        {
          icon: 'megaphone-outline' as const,
          title: 'Marketing Tools',
          description: 'Access to email campaigns and social media integrations',
        },
        {
          icon: 'time-outline' as const,
          title: 'Extended Listing Duration',
          description: 'Listings stay active longer with auto-renewal options',
        },
        {
          icon: 'star-outline' as const,
          title: 'Platinum Badge Display',
          description: 'Platinum ring around your profile shows your elite seller status',
        },
      ],
    }
  } else if (level === 6) {
    return {
      title: 'Level 6 - Diamond Tier',
      ringColor: STORE_COLORS.diamond,
      ringName: 'Diamond Ring',
      benefits: [
        {
          icon: 'crown-outline' as const,
          title: 'Elite Status',
          description: 'Highest tier recognition with exclusive diamond badge',
        },
        {
          icon: 'business-outline' as const,
          title: 'Store Customization',
          description: 'Fully customize your store with custom themes and branding',
        },
        {
          icon: 'headset-outline' as const,
          title: 'Dedicated Account Manager',
          description: 'Personal support representative for your store',
        },
        {
          icon: 'flash-outline' as const,
          title: 'Early Access Features',
          description: 'Be first to try new platform features and tools',
        },
        {
          icon: 'diamond' as const,
          title: 'Diamond Ring Badge',
          description: 'Diamond ring around your profile shows your top-tier seller status',
        },
      ],
    }
  }
  return null
}

export function LevelRewardModal({
  visible,
  level,
  onClose,
}: LevelRewardModalProps) {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)
  const rewards = getLevelRewards(level)

  if (!rewards) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{rewards.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled={true}
            bounces={false}
          >
            {/* Content */}
            <View style={styles.content}>
              {/* Profile Ring Preview */}
              <View style={styles.ringPreviewSection}>
                <View style={styles.ringPreviewContainer}>
                  <View style={styles.profilePreview}>
                    <View style={styles.profileCircle}>
                      <Text style={styles.profileInitials}>MK</Text>
                    </View>
                    <View style={[styles.ringOuter, { borderColor: rewards.ringColor }]} />
                    <View style={[styles.ringInner, { borderColor: rewards.ringColor }]} />
                  </View>
                </View>
                <Text style={styles.ringTitle}>{rewards.ringName}</Text>
                <Text style={styles.ringDescription}>
                  Unlock a {rewards.ringName.toLowerCase()} around your profile picture to show your trusted seller status
                </Text>
              </View>

              <Text style={styles.descriptionText}>
                By reaching Level {level}, you'll receive:
              </Text>
              <View style={styles.benefitsContainer}>
                {rewards.benefits.map((benefit, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.benefitBlock,
                      index === rewards.benefits.length - 1 && { marginBottom: 0 }
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={rewards.ringColor}
                      style={styles.checkIcon}
                    />
                    <Text style={styles.benefitText}>{benefit.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlayTouchable: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContainer: {
      backgroundColor: theme.backgroundColor,
      borderRadius: RADIUS.lg,
      width: '85%',
      maxWidth: 400,
      maxHeight: '85%',
      padding: SPACING.containerPadding,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: SPACING.xs,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    title: {
      fontSize: TYPOGRAPHY.h2,
      fontFamily: theme.boldFont,
      color: theme.textColor,
      fontWeight: '600',
      flex: 1,
    },
    closeButton: {
      padding: SPACING.xs,
      marginLeft: SPACING.sm,
    },
    content: {
      marginBottom: SPACING.md,
    },
    ringPreviewSection: {
      alignItems: 'center',
      marginBottom: SPACING.lg,
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.md,
      backgroundColor: theme.cardBackground || '#000000',
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    ringPreviewContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SPACING.md,
    },
    profilePreview: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    profileCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.textColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#FFFFFF',
      zIndex: 2,
    },
    profileInitials: {
      color: theme.backgroundColor,
      fontFamily: theme.boldFont,
      fontSize: TYPOGRAPHY.h3,
      fontWeight: '600',
    },
    ringOuter: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      opacity: 0.8,
      zIndex: 1,
    },
    ringInner: {
      position: 'absolute',
      width: 90,
      height: 90,
      borderRadius: 45,
      borderWidth: 2,
      opacity: 0.6,
      zIndex: 1,
    },
    ringTitle: {
      fontSize: TYPOGRAPHY.h3,
      fontFamily: theme.boldFont,
      color: theme.textColor,
      fontWeight: '600',
      marginBottom: SPACING.xs,
      textAlign: 'center',
    },
    ringDescription: {
      fontSize: TYPOGRAPHY.bodySmall,
      fontFamily: theme.regularFont,
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      lineHeight: TYPOGRAPHY.bodySmall * 1.4,
    },
    descriptionText: {
      fontSize: TYPOGRAPHY.body,
      fontFamily: theme.regularFont,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: SPACING.lg,
      lineHeight: TYPOGRAPHY.body * 1.4,
    },
    benefitsContainer: {
      backgroundColor: theme.cardBackground || '#000000',
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    benefitBlock: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.cardBackground || '#000000',
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    checkIcon: {
      marginRight: SPACING.sm,
      marginTop: 2,
    },
    benefitText: {
      flex: 1,
      fontSize: TYPOGRAPHY.body,
      fontFamily: theme.regularFont,
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: TYPOGRAPHY.body * 1.4,
    },
  })
