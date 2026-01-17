import { useContext, useState, useMemo } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../components/ui/text'
import { ThemeContext } from '../context'
import { SPACING, TYPOGRAPHY, RADIUS } from '../constants/layout'
import Ionicons from '@expo/vector-icons/Ionicons'
import { AuctionSection, CreateAuctionModal, type Auction, OrderCard, type Order, ListItemModal } from '../components/profile'
import { Section } from '../components/layout/Section'
import {
  StoreHeader,
  StoreStats,
  StoreListings,
  SafetyFilter,
} from '../components/store'
import { type StoreListing } from '../components/store/StoreListings'

type MyStoreStackParamList = {
  MyStoreMain: undefined
  Product: {
    id?: string
    name: string
    image: any
    category?: 'product' | 'set' | 'single' | 'featured' | 'listing'
    price?: number
    description?: string
  }
}

type MyStoreScreenNavigationProp = NativeStackNavigationProp<MyStoreStackParamList, 'MyStoreMain'>

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

export function MyStore() {
  const { theme } = useContext(ThemeContext)
  const navigation = useNavigation<MyStoreScreenNavigationProp>()
  const styles = getStyles(theme)
  const [activeTab, setActiveTab] = useState('MY STORE')
  const [vaultedOnly, setVaultedOnly] = useState(false)
  const [isListItemModalVisible, setIsListItemModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; image?: any } | null>(null)
  const [isCreateAuctionModalVisible, setIsCreateAuctionModalVisible] = useState(false)
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [editingListing, setEditingListing] = useState<StoreListing | null>(null)

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
  }

  // Sample listings data
  const allListings: StoreListing[] = [
    {
      id: '1',
      cardName: 'Shining Charizard Secret',
      cardImage: require('../../assets/singles/Shining_Charizard_Secret.jpg'),
      price: 165.00,
      vaultingStatus: 'vaulted',
      purchaseType: 'both',
      currentBid: 145.00,
      bidCount: 3,
    },
    {
      id: '2',
      cardName: 'Mew',
      cardImage: require('../../assets/singles/Mew.jpg'),
      price: 62.00,
      vaultingStatus: 'seller-has',
      purchaseType: 'instant',
      currentBid: 42.00,
      bidCount: 2,
    },
    {
      id: '3',
      cardName: 'Blastoise EX',
      cardImage: require('../../assets/singles/Blastoise_ex.jpg'),
      price: 95.00,
      vaultingStatus: 'vaulted',
      purchaseType: 'both',
      currentBid: 75.00,
      bidCount: 1,
    },
    {
      id: '4',
      cardName: 'Umbreon EX',
      cardImage: require('../../assets/singles/Umbreon_ex.jpg'),
      price: 110.00,
      vaultingStatus: 'vaulted',
      purchaseType: 'instant',
      currentBid: 90.00,
      bidCount: 4,
    },
    {
      id: '5',
      cardName: 'Mega Charizard X',
      cardImage: require('../../assets/singles/Mega_Charizard_X.jpg'),
      price: 215.00,
      vaultingStatus: 'seller-has',
      purchaseType: 'both',
      currentBid: 195.00,
      bidCount: 5,
    },
    {
      id: '6',
      cardName: 'Hidden Fates Elite Trainer Box',
      cardImage: require('../../assets/products/pokevault/Pokmon_TCG_Hidden_Fates_Elite_Trainer_Box.jpg'),
      price: 135.00,
      vaultingStatus: 'vaulted',
      purchaseType: 'instant',
      currentBid: 115.00,
      bidCount: 2,
    },
  ]

  const filteredListings = allListings.filter(listing => {
    if (vaultedOnly) {
      return listing.vaultingStatus === 'vaulted'
    }
    return true
  })

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
      order.status === 'processing' || order.status === 'shipped'
    )
  }

  const getCompletedOrders = (): Order[] => {
    return orders.filter(order => order.status === 'completed')
  }

  const tabs = ['AUCTIONS', 'MY STORE', 'ORDERS']

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.contentWrapper}>
          {activeTab === 'AUCTIONS' && (
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
                  isOwnListing={true}
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
                  onEditPress={(listing: StoreListing) => {
                    // Open edit modal with listing data
                    setEditingListing(listing)
                    setSelectedProduct({ 
                      name: listing.cardName, 
                      image: listing.cardImage || null 
                    })
                    setIsListItemModalVisible(true)
                  }}
                  onBuyPress={(listing) => {
                    // Not used for own listings
                  }}
                  onBidPress={(listing) => {
                    // Not used for own listings
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
          initialPrice={editingListing?.price}
          initialDescription={editingListing ? `Premium ${editingListing.cardName}. Authentic and verified with secure shipping.` : undefined}
          onClose={() => {
            setIsListItemModalVisible(false)
            setSelectedProduct(null)
            setEditingListing(null)
          }}
          onList={(price) => {
            if (editingListing) {
              // TODO: Handle updating the listing with the new price
              console.log('Update listing:', editingListing.cardName, 'new price:', price)
            } else {
              // TODO: Handle creating a new listing with the price
              console.log('List item:', selectedProduct.name, 'at price:', price)
            }
            setIsListItemModalVisible(false)
            setSelectedProduct(null)
            setEditingListing(null)
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

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  scrollContent: {
    paddingHorizontal: SPACING.containerPadding,
    paddingTop: SPACING.md,
    paddingBottom: SPACING['4xl'],
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.backgroundColor,
    borderRadius: RADIUS.sm,
    padding: SPACING.xs,
    marginBottom: SPACING['2xl'],
    borderWidth: 1,
    borderColor: theme.textColor,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    borderRadius: RADIUS.sm - 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  tabButtonActive: {
    backgroundColor: theme.textColor,
  },
  tabText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: theme.semiBoldFont,
    color: theme.textColor,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: theme.backgroundColor,
  },
  contentWrapper: {
    width: '100%',
  },
  ordersContainer: {
    gap: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['2xl'],
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: theme.regularFont,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: SPACING.md,
  },
})
