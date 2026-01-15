import { useContext, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../components/ui/text'
import { ThemeContext } from '../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../constants/layout'
import { Section } from '../components/layout/Section'
import { Card, CardContent } from '../components/ui/card'
import Ionicons from '@expo/vector-icons/Ionicons'
import {
  StoreHeader,
  StoreStats,
  StoreListings,
  SafetyFilter,
} from '../components/store'
import { type StoreListing } from '../components/store/StoreListings'
import { AuctionSection, type Auction } from '../components/profile'

type ViewProfileStackParamList = {
  ViewProfile: {
    userId: string
    userName: string
    userImage?: any
    userInitials?: string
    verified?: boolean
  }
  Product: {
    id?: string
    name: string
    image: any
    category?: 'product' | 'set' | 'single' | 'featured' | 'listing'
    price?: number
    description?: string
  }
}

type ViewProfileScreenRouteProp = RouteProp<ViewProfileStackParamList, 'ViewProfile'>
type ViewProfileScreenNavigationProp = NativeStackNavigationProp<ViewProfileStackParamList, 'ViewProfile'>

export function ViewProfile() {
  const { theme } = useContext(ThemeContext)
  const navigation = useNavigation<ViewProfileScreenNavigationProp>()
  const route = useRoute<ViewProfileScreenRouteProp>()
  const { userId, userName, userImage, userInitials, verified } = route.params || {
    userId: '',
    userName: 'User',
    userInitials: 'U',
    verified: false,
  }
  const styles = getStyles(theme)
  const [vaultedOnly, setVaultedOnly] = useState(false)
  const [reviewsExpanded, setReviewsExpanded] = useState(false)

  // Sample auctions data for the viewed user
  const userAuctions: Auction[] = [
    {
      id: 'auction-1',
      title: 'Rare Charizard Collection',
      description: 'Auctioning off my premium Charizard cards.',
      status: 'live',
      timeRemaining: 'Ends in 2h 30m',
      currentBid: 450,
      bidCount: 12,
      image: require('../../assets/singles/Shining_Charizard_Secret.jpg'),
    },
    {
      id: 'auction-2',
      title: 'Hidden Fates Elite Trainer Box',
      description: 'New in box, never opened. Starting bid $120.',
      status: 'starting',
      timeRemaining: 'Starts in 45m',
      currentBid: 120,
      bidCount: 3,
    },
  ]

  // Sample reviews data
  const reviews = [
    {
      id: '1',
      reviewerName: 'Alex Johnson',
      reviewerAvatar: require('../../assets/Avatars/guy1.jpg'),
      rating: 5,
      date: '2 days ago',
      comment: 'Great seller! Fast shipping and card was exactly as described. Highly recommend!',
    },
    {
      id: '2',
      reviewerName: 'Sarah Martinez',
      reviewerAvatar: require('../../assets/Avatars/guy5.jpg'),
      rating: 5,
      date: '1 week ago',
      comment: 'Perfect condition, well packaged. Will definitely buy from again.',
    },
    {
      id: '3',
      reviewerName: 'Michael Chen',
      reviewerAvatar: require('../../assets/Avatars/guy2.jpg'),
      rating: 4,
      date: '2 weeks ago',
      comment: 'Good communication and quick response. Card arrived safely.',
    },
    {
      id: '4',
      reviewerName: 'Emily Rodriguez',
      reviewerAvatar: require('../../assets/Avatars/guy4.jpg'),
      rating: 5,
      date: '3 weeks ago',
      comment: 'Excellent service! The card was in mint condition as promised.',
    },
  ]

  // Sample store data for the viewed profile
  const storeData = {
    name: `${userName}'s Card Shop`,
    level: 3,
    currentXP: 450,
    xpToNextLevel: 600,
    salesCount: 12,
    totalSales: 12,
    totalRevenue: 1250,
    shareableLink: `gradeit.app/store/${userId}`,
    listings: [
      {
        id: '1',
        cardImage: require('../../assets/singles/Shining_Charizard_Secret.jpg'),
        cardName: 'Shining Charizard Secret',
        price: 165,
        vaultingStatus: 'vaulted' as const,
        purchaseType: 'both' as const,
        currentBid: 145,
        bidCount: 3,
      },
      {
        id: '2',
        cardImage: require('../../assets/singles/Mew.jpg'),
        cardName: 'Mew',
        price: 62,
        vaultingStatus: 'seller-has' as const,
        purchaseType: 'instant' as const,
        currentBid: 42,
        bidCount: 2,
      },
      {
        id: '3',
        cardImage: require('../../assets/singles/Blastoise_ex.jpg'),
        cardName: 'Blastoise EX',
        price: 95,
        vaultingStatus: 'vaulted' as const,
        purchaseType: 'both' as const,
        currentBid: 75,
        bidCount: 1,
      },
      {
        id: '4',
        cardImage: require('../../assets/singles/Umbreon_ex.jpg'),
        cardName: 'Umbreon EX',
        price: 110,
        vaultingStatus: 'vaulted' as const,
        purchaseType: 'instant' as const,
        currentBid: 90,
        bidCount: 4,
      },
      {
        id: '5',
        cardImage: require('../../assets/singles/Mega_Charizard_X.jpg'),
        cardName: 'Mega Charizard X',
        price: 215,
        vaultingStatus: 'seller-has' as const,
        purchaseType: 'both' as const,
        currentBid: 195,
        bidCount: 5,
      },
      {
        id: '6',
        cardImage: require('../../assets/products/pokevault/Pokmon_TCG_Hidden_Fates_Elite_Trainer_Box.jpg'),
        cardName: 'Hidden Fates Elite Trainer Box',
        price: 135,
        vaultingStatus: 'vaulted' as const,
        purchaseType: 'instant' as const,
        currentBid: 115,
        bidCount: 2,
      },
    ],
  }

  // Filter listings based on vaulted only
  const filteredListings = vaultedOnly
    ? storeData.listings.filter(l => l.vaultingStatus === 'vaulted')
    : storeData.listings

  const getInitials = () => {
    if (userInitials) return userInitials
    const names = userName.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return userName.substring(0, 2).toUpperCase()
  }

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <StoreHeader
          storeName={storeData.name}
          profileImage={userImage}
          profileInitials={getInitials()}
          level={storeData.level}
          currentXP={storeData.currentXP}
          xpToNextLevel={storeData.xpToNextLevel}
          salesCount={storeData.salesCount}
          shareableLink={storeData.shareableLink}
        />

        <Section title="Store Stats">
          <StoreStats
            totalSales={storeData.totalSales}
            totalRevenue={storeData.totalRevenue}
            responseTime="2h"
            reviewPercentage={98}
          />
        </Section>

        {userAuctions.length > 0 && (
          <Section title="Auctions">
            <AuctionSection
              auctions={userAuctions}
              onAuctionPress={(auction) => {
                // TODO: Navigate to auction detail page
                console.log('Auction pressed:', auction.id)
              }}
              showCreateButton={false}
            />
          </Section>
        )}

        <Section title="Reviews">
          <Card style={styles.reviewsCard}>
            <CardContent style={styles.reviewsCardContent}>
              <TouchableOpacity
                style={styles.reviewsHeader}
                onPress={() => setReviewsExpanded(!reviewsExpanded)}
                activeOpacity={0.7}
              >
                <View style={styles.reviewsHeaderLeft}>
                  <View style={styles.reviewsIconContainer}>
                    <Ionicons name="star" size={20} color="#73EC8B" />
                  </View>
                  <View>
                    <Text style={styles.reviewsTitle}>Customer Reviews</Text>
                    <Text style={styles.reviewsSubtitle}>{reviews.length} reviews • 4.8 average</Text>
                  </View>
                </View>
                <Ionicons
                  name={reviewsExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </TouchableOpacity>

              {reviewsExpanded && (
                <View style={styles.reviewsList}>
                  {reviews.map((review) => (
                    <TouchableOpacity
                      key={review.id}
                      style={styles.reviewItem}
                      onPress={() => {
                        navigation.navigate('ViewProfile', {
                          userId: `user-${review.reviewerName.toLowerCase().replace(/\s+/g, '-')}`,
                          userName: review.reviewerName,
                          userImage: review.reviewerAvatar,
                          userInitials: review.reviewerName.split(' ').map(n => n[0]).join('').toUpperCase(),
                          verified: false,
                        })
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.reviewHeader}>
                        <Image
                          source={review.reviewerAvatar}
                          style={styles.reviewerAvatar}
                        />
                        <View style={styles.reviewerInfo}>
                          <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                          <View style={styles.reviewRating}>
                            {[...Array(5)].map((_, i) => (
                              <Ionicons
                                key={i}
                                name={i < review.rating ? "star" : "star-outline"}
                                size={12}
                                color={theme.tintColor || '#73EC8B'}
                              />
                            ))}
                            <Text style={styles.reviewDate}>{review.date}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.reviewComment}>{review.comment}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </CardContent>
          </Card>
        </Section>

        <Section title="Listings">
          <SafetyFilter
            enabled={vaultedOnly}
            onToggle={setVaultedOnly}
          />
          <StoreListings
            listings={filteredListings}
            onListingPress={(listing: StoreListing) => {
              if (listing.cardImage) {
                navigation.navigate('Product', {
                  name: listing.cardName,
                  image: listing.cardImage,
                  category: 'listing',
                  price: listing.price,
                  description: `Premium ${listing.cardName}. Authentic and verified with secure shipping.`,
                })
              }
            }}
            onBuyPress={(listing) => {
              // TODO: Handle instant buy
            }}
            onBidPress={(listing) => {
              // TODO: Open bid modal
            }}
          />
        </Section>
      </ScrollView>
    </View>
  )
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.containerPadding,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: theme.backgroundColor,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.h2,
    fontFamily: theme.boldFont,
    color: theme.textColor,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 44,
  },
  scrollContentContainer: {
    paddingHorizontal: SPACING.containerPadding,
    paddingBottom: SPACING['4xl'],
  },
  reviewsCard: {
    backgroundColor: theme.cardBackground || '#000000',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: theme.borderColor || 'rgba(255, 255, 255, 0.08)',
    marginBottom: SPACING.md,
  },
  reviewsCardContent: {
    padding: SPACING.cardPadding,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  reviewsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewsTitle: {
    fontSize: TYPOGRAPHY.h4,
    fontFamily: theme.semiBoldFont,
    color: theme.textColor,
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
  },
  reviewsSubtitle: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  reviewsList: {
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  reviewItem: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.semiBoldFont,
    color: theme.textColor,
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  reviewDate: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: SPACING.xs,
  },
  reviewComment: {
    fontSize: TYPOGRAPHY.bodySmall,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
})
