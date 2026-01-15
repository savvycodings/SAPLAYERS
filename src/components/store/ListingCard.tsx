import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useContext } from 'react'
import { Text } from '../ui/text'
import { Card, CardContent } from '../ui/card'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ThemeContext } from '../../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../../constants/layout'
import { VaultingBadge } from './VaultingBadge'

type VaultingStatus = 'vaulted' | 'seller-has' | 'unverified'
type PurchaseType = 'instant' | 'bid' | 'both'

interface ListingCardProps {
  id: string
  cardImage?: any
  cardName: string
  price: number
  vaultingStatus: VaultingStatus
  purchaseType: PurchaseType
  currentBid?: number
  bidCount?: number
  onPress?: () => void
  onBuyPress?: () => void
  onBidPress?: () => void
}

export function ListingCard({
  cardImage,
  cardName,
  price,
  vaultingStatus,
  purchaseType,
  currentBid,
  bidCount = 0,
  onPress,
  onBuyPress,
  onBidPress,
}: ListingCardProps) {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Card style={styles.card}>
        <CardContent style={styles.cardContent}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            {cardImage ? (
              <Image
                source={cardImage}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="image-outline"
                  size={32}
                  color="rgba(255, 255, 255, 0.3)"
                />
              </View>
            )}
            <View style={styles.badgeContainer}>
              <VaultingBadge status={vaultingStatus} size="sm" />
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.cardName} numberOfLines={2}>
              {cardName}
            </Text>

            {/* Always show bid info if there's a current bid, otherwise show price */}
            {currentBid ? (
              <View style={styles.bidInfo}>
                <Text style={styles.bidLabel}>
                  Bid: ${currentBid}
                </Text>
                {bidCount > 0 && (
                  <Text style={styles.bidCount}>{bidCount} bids</Text>
                )}
              </View>
            ) : (
              <Text style={styles.price}>${price}</Text>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {purchaseType === 'instant' || purchaseType === 'both' ? (
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={onBuyPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.buyButtonText}>Buy Now ${price}</Text>
                </TouchableOpacity>
              ) : null}
              {/* Always show bid button - everything is biddable */}
              <TouchableOpacity
                style={styles.bidButton}
                onPress={onBidPress}
                activeOpacity={0.7}
              >
                <Text style={styles.bidButtonText}>Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  cardContainer: {
    width: '31%',
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: theme.cardBackground || '#000000',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 0,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
  },
  infoSection: {
    padding: SPACING.sm,
  },
  cardName: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.semiBoldFont,
    color: theme.textColor,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    minHeight: 32,
  },
  price: {
    fontSize: TYPOGRAPHY.h4,
    fontFamily: theme.boldFont,
    color: theme.tintColor || '#73EC8B',
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  bidInfo: {
    marginBottom: SPACING.sm,
  },
  bidLabel: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.semiBoldFont,
    color: theme.tintColor || '#73EC8B',
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
  },
  bidCount: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  actionsContainer: {
    gap: SPACING.xs,
  },
  buyButton: {
    backgroundColor: theme.tintColor || '#73EC8B',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.semiBoldFont,
    color: '#000000',
    fontWeight: '600',
  },
  bidButton: {
    backgroundColor: theme.buttonBackground || 'rgba(0, 0, 0, 0.8)',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bidButtonText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.semiBoldFont,
    color: theme.textColor,
    fontWeight: '600',
  },
})
