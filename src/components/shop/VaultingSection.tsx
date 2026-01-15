import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useContext } from 'react'
import { Text } from '../ui/text'
import { Carousel } from '../Carousel'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/layout'

interface VaultingItem {
  title: string
  description: string
  buttonText: string
  image?: any
  backgroundColor?: string
}

export function VaultingSection() {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)

  const vaultingItems: VaultingItem[] = [
    {
      title: 'Get Your Card Vaulted Today',
      description: 'Secure storage for your valuable cards in a climate controlled facility. We can sell them for you when you\'re ready.',
      buttonText: 'Apply Today',
      backgroundColor: '#DC2626',
    },
    {
      title: 'Professional Authentication',
      description: 'Get your cards professionally graded and authenticated by industry experts before vaulting.',
      buttonText: 'Learn More',
      backgroundColor: '#1A1A1A',
    },
  ]

  return (
    <Carousel
      items={vaultingItems}
      renderItem={(item) => (
        <View style={[styles.vaultingCard, { backgroundColor: item.backgroundColor || '#DC2626' }]}>
          {item.image && (
            <Image
              source={item.image}
              style={styles.vaultingBackgroundImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.vaultingContent}>
            <View style={styles.vaultingTopContent}>
              <Text style={styles.vaultingLabel}>VAULTING</Text>
              <Text style={styles.vaultingTitle}>{item.title}</Text>
            </View>
            <View style={styles.vaultingBottomContent}>
              <View style={styles.vaultingLeftContent}>
                <Text style={styles.vaultingDescription}>{item.description}</Text>
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
                  <Text style={styles.vaultingButtonText}>{item.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      itemWidth={360}
      itemHeight={200}
      itemSpacing={8}
    />
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  vaultingCard: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.cardPadding,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  vaultingBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  vaultingContent: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  vaultingTopContent: {
    width: '100%',
    marginBottom: 10,
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
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  vaultingBottomContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  vaultingLeftContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  vaultingDescription: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.9)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shieldIcon: {
    marginRight: 6,
  },
  vaultingButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: theme.semiBoldFont,
    color: theme.textColor,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
})
