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
      <View style={styles.vaultingContent}>
        <View style={styles.vaultingLeftContent}>
          <Text style={styles.vaultingLabel}>VAULTING</Text>
          <Text style={styles.vaultingTitle}>Get Your Cards Vaulted</Text>
          <Text style={styles.vaultingTitle}>and Professionally Graded</Text>
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: theme.cardBackground || '#000000',
    minHeight: 200,
  },
  vaultingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  vaultingLeftContent: {
    flex: 1,
    paddingRight: SPACING.lg,
    justifyContent: 'center',
  },
  vaultingLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.regularFont,
    color: theme.mutedForegroundColor || 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  vaultingTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: theme.boldFont,
    color: theme.textColor,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  vaultingDescription: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: theme.regularFont,
    color: theme.mutedForegroundColor || 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
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
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaultingImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
  },
})
