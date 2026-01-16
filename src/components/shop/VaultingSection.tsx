import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useContext } from 'react'
import { Text } from '../ui/text'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/layout'

export function VaultingSection() {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)

  return (
    <View style={styles.vaultingCard}>
      <View style={styles.vaultingTopContent}>
        <Text style={styles.vaultingLabel}>VAULTING</Text>
        <Text style={styles.vaultingTitle}>Get Your Cards Vaulted & Professionally Graded</Text>
      </View>
      <View style={styles.vaultingBottomContent}>
        <View style={styles.vaultingLeftContent}>
          <Text style={styles.vaultingDescription}>
            Secure storage for your valuable cards in a climate controlled facility. Get your cards professionally graded and authenticated by industry experts before vaulting. We can sell them for you when you're ready.
          </Text>
          <TouchableOpacity
            style={styles.vaultingButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color="#FFFFFF"
              style={styles.shieldIcon}
            />
            <Text style={styles.vaultingButtonText}>Apply Today</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.vaultingRightContent}>
          <Image
            source={require('../../../assets/banner/slabs.png')}
            style={styles.vaultingImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  vaultingCard: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.cardPadding,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.1)',
    backgroundColor: theme.cardBackground || '#000000',
    minHeight: 200,
  },
  vaultingTopContent: {
    width: '100%',
    marginBottom: 12,
  },
  vaultingLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.regularFont,
    color: theme.mutedForegroundColor || 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  vaultingTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: theme.boldFont,
    color: theme.textColor,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.2,
    width: '100%',
  },
  vaultingBottomContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  vaultingLeftContent: {
    flex: 1,
    width: '50%',
    paddingRight: SPACING.sm,
    justifyContent: 'space-between',
  },
  vaultingDescription: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.regularFont,
    color: theme.mutedForegroundColor || 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 12,
    flexShrink: 1,
  },
  vaultingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    backgroundColor: theme.tintColor || '#73EC8B',
    borderWidth: 1,
    borderColor: theme.tintColor || '#73EC8B',
  },
  shieldIcon: {
    marginRight: 6,
  },
  vaultingButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: theme.semiBoldFont,
    color: theme.tintTextColor || '#000000',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  vaultingRightContent: {
    flex: 1,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
  },
  vaultingImage: {
    width: '100%',
    height: 160,
    borderRadius: RADIUS.md,
  },
})
