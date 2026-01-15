import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../ui/text'
import { Carousel } from '../Carousel'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/layout'

interface VerifiedStore {
  first: string
  last: string
  image: any
  verified: boolean
}

interface VerifiedStoresCarouselProps {
  items: VerifiedStore[]
  onApplyPress?: () => void
}

type ShopStackParamList = {
  ShopMain: undefined
  ViewProfile: {
    userId: string
    userName: string
    userImage?: any
    userInitials?: string
    verified?: boolean
  }
}

type VerifiedStoresCarouselNavigationProp = NativeStackNavigationProp<ShopStackParamList, 'ShopMain'>

export function VerifiedStoresCarousel({ items, onApplyPress }: VerifiedStoresCarouselProps) {
  const { theme } = useContext(ThemeContext)
  const navigation = useNavigation<VerifiedStoresCarouselNavigationProp>()
  const styles = getStyles(theme)

  return (
    <View>
      <Carousel
        items={items}
        renderItem={(item) => (
          <TouchableOpacity
            style={styles.storeWrapper}
            onPress={() => {
              navigation.navigate('ViewProfile', {
                userId: `${item.first.toLowerCase()}-${item.last.toLowerCase()}`,
                userName: `${item.first} ${item.last}`,
                userImage: item.image,
                userInitials: `${item.first[0]}${item.last[0]}`,
                verified: item.verified,
              })
            }}
            activeOpacity={0.8}
          >
            <View style={styles.storeImageContainer}>
              <Image
                source={item.image}
                style={styles.storeImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.storeNameContainer}>
              <Text style={styles.storeNameText}>
                {item.first} {item.last}
              </Text>
            {item.verified && (
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={theme.tintColor || '#10B981'}
                style={styles.verifiedIcon}
              />
            )}
            </View>
          </TouchableOpacity>
        )}
        itemWidth={120}
        itemHeight={170}
        itemSpacing={12}
      />
      <TouchableOpacity 
        style={styles.applyBanner}
        activeOpacity={0.7}
        onPress={onApplyPress}
      >
        <View style={styles.applyBannerContent}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={theme.mutedForegroundColor || 'rgba(255, 255, 255, 0.7)'}
          />
          <Text style={styles.applyBannerText}>
            Apply to become a verified store
          </Text>
          <Ionicons
            name="chevron-forward"
            size={14}
            color={theme.mutedForegroundColor || 'rgba(255, 255, 255, 0.5)'}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  storeWrapper: {
    alignItems: 'center',
  },
  storeImageContainer: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.15)',
  },
  storeImage: {
    width: '120%',
    height: '120%',
    borderRadius: RADIUS.full,
    marginLeft: '-10%',
    marginTop: '-10%',
  },
  storeNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  storeNameText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.semiBoldFont,
    color: theme.textColor,
    textAlign: 'center',
    letterSpacing: 0.1,
    fontWeight: '600',
  },
  verifiedIcon: {
    marginLeft: SPACING.xs,
  },
  applyBanner: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: theme.cardBackground || '#000000',
    borderWidth: 1,
    borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.08)',
  },
  applyBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBannerText: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.regularFont,
    color: theme.mutedForegroundColor || 'rgba(255, 255, 255, 0.7)',
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
    letterSpacing: 0.1,
  },
})
