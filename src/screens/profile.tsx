import { useContext, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../components/ui/text'
import { ThemeContext } from '../context'
import { SPACING, TYPOGRAPHY } from '../constants/layout'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ProfileHeader, ProfileTabs, SellCardsBanner, ProfileStats, PortfolioGraph, ActionButtons, ProductGrid, GoalProgress, SetChart, ListItemModal, OrderCard, type Order, AuctionSection, CreateAuctionModal, type Auction } from '../components/profile'
import { Section } from '../components/layout/Section'
import {
  StoreHeader,
  StoreStats,
  StoreListings,
  SafetyFilter,
} from '../components/store'
import { type StoreListing } from '../components/store/StoreListings'

type ProfileStackParamList = {
  ProfileMain: undefined
  Product: {
    id?: string
    name: string
    image: any
    category?: 'product' | 'set' | 'single' | 'featured' | 'listing'
    price?: number
    description?: string
  }
}

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>

export function Profile() {
  const { theme } = useContext(ThemeContext)
  const navigation = useNavigation<ProfileScreenNavigationProp>()
  const styles = getStyles(theme)
  const [activeTab, setActiveTab] = useState('STATS')
  const [vaultedOnly, setVaultedOnly] = useState(false)
  const [isListItemModalVisible, setIsListItemModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; image?: any } | null>(null)
  const [isCreateAuctionModalVisible, setIsCreateAuctionModalVisible] = useState(false)
  const [auctions, setAuctions] = useState<Auction[]>([])

  // Sample orders data
  const orders: Order[] = [
    {
      id: '1',
      itemName: 'Shining Charizard Secret',
      itemImage: require('../../assets/singles/Shining_Charizard_Secret.jpg'),
      price: 165.00,
      quantity: 1,
      orderDate: 'Dec 15, 2024',
      status: 'processing',
      orderNumber: 'ORD-2024-001',
    },
    {
      id: '2',
      itemName: 'Mew',
      itemImage: require('../../assets/singles/Mew.jpg'),
      price: 45.00,
      quantity: 1,
      orderDate: 'Dec 10, 2024',
      status: 'shipped',
      orderNumber: 'ORD-2024-002',
    },
    {
      id: '3',
      itemName: 'Blastoise EX',
      itemImage: require('../../assets/singles/Blastoise_ex.jpg'),
      price: 80.00,
      quantity: 2,
      orderDate: 'Dec 5, 2024',
      status: 'completed',
      orderNumber: 'ORD-2024-003',
    },
    {
      id: '4',
      itemName: 'Umbreon EX',
      itemImage: require('../../assets/singles/Umbreon_ex.jpg'),
      price: 95.00,
      quantity: 1,
      orderDate: 'Nov 28, 2024',
      status: 'completed',
      orderNumber: 'ORD-2024-004',
    },
    {
      id: '5',
      itemName: 'Mega Charizard X',
      itemImage: require('../../assets/singles/Mega_Charizard_X.jpg'),
      price: 200.00,
      quantity: 1,
      orderDate: 'Nov 20, 2024',
      status: 'completed',
      orderNumber: 'ORD-2024-005',
    },
  ]

  const getOngoingOrders = (): Order[] => {
    return orders.filter(order => 
      order.status !== 'completed' && order.status !== 'cancelled'
    )
  }

  const getCompletedOrders = (): Order[] => {
    return orders.filter(order => 
      order.status === 'completed' || order.status === 'cancelled'
    )
  }

  // Sample store data
  const storeData = {
    name: 'Kyle\'s Card Shop',
    level: 3,
    currentXP: 450,
    xpToNextLevel: 600,
    salesCount: 12,
    totalSales: 12,
    totalRevenue: 1250,
    shareableLink: 'gradeit.app/store/kyle',
    listings: [
      {
        id: '1',
        cardImage: require('../../assets/singles/Shining_Charizard_Secret.jpg'),
        cardName: 'Shining Charizard Secret',
        price: 165, // $20 more than current bid (145 + 20)
        vaultingStatus: 'vaulted' as const,
        purchaseType: 'both' as const,
        currentBid: 145,
        bidCount: 3,
      },
      {
        id: '2',
        cardImage: require('../../assets/singles/Mew.jpg'),
        cardName: 'Mew',
        price: 62, // $20 more than current bid (42 + 20)
        vaultingStatus: 'seller-has' as const,
        purchaseType: 'instant' as const,
        currentBid: 42,
        bidCount: 2,
      },
      {
        id: '3',
        cardImage: require('../../assets/singles/Blastoise_ex.jpg'),
        cardName: 'Blastoise EX',
        price: 95, // $20 more than current bid (75 + 20)
        vaultingStatus: 'vaulted' as const,
        purchaseType: 'both' as const,
        currentBid: 75,
        bidCount: 1,
      },
      {
        id: '4',
        cardImage: require('../../assets/singles/Umbreon_ex.jpg'),
        cardName: 'Umbreon EX',
        price: 110, // $20 more than current bid (90 + 20)
        vaultingStatus: 'vaulted' as const,
        purchaseType: 'instant' as const,
        currentBid: 90,
        bidCount: 4,
      },
      {
        id: '5',
        cardImage: require('../../assets/singles/Mega_Charizard_X.jpg'),
        cardName: 'Mega Charizard X',
        price: 215, // $20 more than current bid (195 + 20)
        vaultingStatus: 'seller-has' as const,
        purchaseType: 'both' as const,
        currentBid: 195,
        bidCount: 5,
      },
      {
        id: '6',
        cardImage: require('../../assets/products/pokevault/Pokmon_TCG_Hidden_Fates_Elite_Trainer_Box.jpg'),
        cardName: 'Hidden Fates Elite Trainer Box',
        price: 135, // $20 more than current bid (115 + 20)
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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          userName="Kyle"
          isPremium={true}
          portfolioValue="$67"
          stats={{
            cards: 188,
            sealed: 2,
            slabs: 0,
            total: 190,
          }}
          onEditPress={() => {
            // TODO: Handle edit profile
          }}
        />

        <View style={styles.contentWrapper}>
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'STATS' && (
            <>
              <SellCardsBanner
                onPress={() => {
                  // TODO: Navigate to sell cards page
                }}
              />

              <Section title="Auctions">
                <AuctionSection
                  auctions={auctions}
                  onCreateAuction={() => setIsCreateAuctionModalVisible(true)}
                  onAuctionPress={(auction) => {
                    // TODO: Navigate to auction detail page
                    console.log('Auction pressed:', auction.id)
                  }}
                  showCreateButton={true}
                />
              </Section>

              <Section title="Portfolio Growth">
                <PortfolioGraph
                  data={[
                    { x: 0, y: 45 },
                    { x: 1, y: 52 },
                    { x: 2, y: 48 },
                    { x: 3, y: 55 },
                    { x: 4, y: 62 },
                    { x: 5, y: 58 },
                    { x: 6, y: 67 },
                  ]}
                />
              </Section>

              <ActionButtons
                buttons={[
                  { label: 'Movers', icon: 'add', onPress: () => {} },
                  { label: 'PORTFOLIO', icon: 'add', onPress: () => {} },
                  { label: 'Export', icon: 'add', onPress: () => {} },
                ]}
              />

              <Section title="Your Products">
                <ProductGrid
                  products={[
                    {
                      id: 0,
                      name: 'Shining Charizard',
                      price: '$ 150',
                      image: require('../../assets/singles/Shining_Charizard_Secret.jpg'),
                    },
                    {
                      id: 1,
                      name: 'Mew',
                      price: '$ 45',
                      image: require('../../assets/singles/Mew.jpg'),
                    },
                    {
                      id: 2,
                      name: 'Blastoise EX',
                      price: '$ 80',
                      image: require('../../assets/singles/Blastoise_ex.jpg'),
                    },
                    {
                      id: 3,
                      name: 'Umbreon EX',
                      price: '$ 95',
                      image: require('../../assets/singles/Umbreon_ex.jpg'),
                    },
                    {
                      id: 4,
                      name: 'Mega Charizard X',
                      price: '$ 200',
                      image: require('../../assets/singles/Mega_Charizard_X.jpg'),
                    },
                    {
                      id: 5,
                      name: 'Hidden Fates ETB',
                      price: '$ 120',
                      image: require('../../assets/products/pokevault/Pokmon_TCG_Hidden_Fates_Elite_Trainer_Box.jpg'),
                    },
                  ]}
                  onProductPress={(product) => {
                    setSelectedProduct({ name: product.name, image: product.image })
                    setIsListItemModalVisible(true)
                  }}
                />
              </Section>

              <Section title="Collection Goal">
                <GoalProgress
                  current={190}
                  goal={200}
                  label="Total Cards"
                />
              </Section>

              <Section title="Set Distribution">
                <SetChart
                  data={[
                    { label: 'SET 1', value: 5 },
                    { label: 'SET 2', value: 35 },
                    { label: 'SET 3', value: 25 },
                    { label: 'SET 4', value: 10 },
                    { label: 'SET 5', value: 60 },
                    { label: 'SET 6', value: 40 },
                    { label: 'SET 7', value: 50 },
                  ]}
                />
              </Section>
            </>
          )}

          {activeTab === 'MY STORE' && (
            <>
              <StoreHeader
                storeName={storeData.name}
                profileInitials="MK"
                level={storeData.level}
                currentXP={storeData.currentXP}
                xpToNextLevel={storeData.xpToNextLevel}
                salesCount={storeData.salesCount}
                shareableLink={storeData.shareableLink}
                onEditPress={() => {
                  // TODO: Open customization modal
                }}
              />

              <Section title="Store Stats">
                <StoreStats
                  totalSales={storeData.totalSales}
                  totalRevenue={storeData.totalRevenue}
                  responseTime="2h"
                  reviewPercentage={98}
                />
              </Section>

              <SafetyFilter
                enabled={vaultedOnly}
                onToggle={setVaultedOnly}
              />

              <Section title="My Listings">
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
            </>
          )}

          {activeTab === 'ORDERS' && (
            <>
              <Section title="Ongoing Orders">
                {getOngoingOrders().length > 0 ? (
                  <View style={styles.ordersContainer}>
                    {getOngoingOrders().map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onPress={() => {
                          // TODO: Navigate to order details
                          console.log('Order pressed:', order.id)
                        }}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={48} color="rgba(255, 255, 255, 0.3)" />
                    <Text style={styles.emptyText}>No ongoing orders</Text>
                  </View>
                )}
              </Section>

              <Section title="Completed Orders">
                {getCompletedOrders().length > 0 ? (
                  <View style={styles.ordersContainer}>
                    {getCompletedOrders().map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onPress={() => {
                          // TODO: Navigate to order details
                          console.log('Order pressed:', order.id)
                        }}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="checkmark-circle-outline" size={48} color="rgba(255, 255, 255, 0.3)" />
                    <Text style={styles.emptyText}>No completed orders</Text>
                  </View>
                )}
              </Section>
            </>
          )}
        </View>
      </ScrollView>

      {/* List Item Modal */}
      {selectedProduct && (
        <ListItemModal
          visible={isListItemModalVisible}
          productName={selectedProduct.name}
          productImage={selectedProduct.image}
          onClose={() => {
            setIsListItemModalVisible(false)
            setSelectedProduct(null)
          }}
          onList={(price) => {
            // TODO: Handle listing the item with the price
            console.log('List item:', selectedProduct.name, 'at price:', price)
            setIsListItemModalVisible(false)
            setSelectedProduct(null)
          }}
        />
      )}

      {/* Create Auction Modal */}
      <CreateAuctionModal
        visible={isCreateAuctionModalVisible}
        onClose={() => setIsCreateAuctionModalVisible(false)}
        onCreateAuction={(data) => {
          // Create new auction with generated ID
          const newAuction: Auction = {
            id: `auction-${Date.now()}`,
            title: data.title,
            description: data.description,
            startTime: data.startTime,
            status: 'starting',
            timeRemaining: calculateTimeRemaining(data.startTime),
          }
          setAuctions([...auctions, newAuction])
          setIsCreateAuctionModalVisible(false)
          // TODO: Save auction to backend
          console.log('Created auction:', newAuction)
        }}
      />
    </View>
  )
}

// Helper function to calculate time remaining
function calculateTimeRemaining(startTime: Date): string {
  const now = new Date()
  const diff = startTime.getTime() - now.getTime()
  
  if (diff <= 0) return 'Starting now'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `Starts in ${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `Starts in ${minutes}m`
  } else {
    return 'Starting now'
  }
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  scrollContentContainer: {
    paddingBottom: SPACING['4xl'],
  },
  contentWrapper: {
    backgroundColor: theme.backgroundColor,
    paddingHorizontal: SPACING.containerPadding,
  },
  placeholderContainer: {
    padding: SPACING['2xl'],
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  ordersContainer: {
    width: '100%',
  },
  emptyContainer: {
    padding: SPACING['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: SPACING.md,
  },
})

