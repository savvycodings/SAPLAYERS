import { useContext, useState } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from '../components/ui/text'
import { ThemeContext } from '../context'
import { SPACING, TYPOGRAPHY } from '../constants/layout'
import Ionicons from '@expo/vector-icons/Ionicons'
import { ProfileHeader, ProductGrid, GoalProgress, SetChart, ListItemModal } from '../components/profile'
import { Section } from '../components/layout/Section'

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
  const [isListItemModalVisible, setIsListItemModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; image?: any } | null>(null)

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
          portfolioData={[
            { x: 0, y: 45 },
            { x: 1, y: 52 },
            { x: 2, y: 48 },
            { x: 3, y: 55 },
            { x: 4, y: 62 },
            { x: 5, y: 58 },
            { x: 6, y: 67 },
          ]}
          level={3}
          currentXP={450}
          xpToNextLevel={600}
          profileImage={require('../../assets/Avatars/guy1.jpg')}
          onEditPress={() => {
            // TODO: Handle edit profile
          }}
        />

        <View style={styles.contentWrapper}>
          <Section 
                title="Your Products"
                showSeeAll={true}
                onSeeAllPress={() => {
                  // TODO: Navigate to all products page
                }}
              >
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
                    // Navigate to Product screen (full screen with back arrow and heart)
                    if (product.image) {
                      const price = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
                      navigation.navigate('Product', {
                        name: product.name,
                        image: product.image,
                        category: 'product',
                        price: price,
                        description: `Premium ${product.name}. Authentic and verified with secure shipping.`,
                      })
                    }
                  }}
                  onQuickListPress={(product) => {
                    // Open list item modal to add listing
                    setSelectedProduct({ 
                      name: product.name, 
                      image: product.image 
                    })
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
            // TODO: Handle creating a new listing with the price
            console.log('List item:', selectedProduct.name, 'at price:', price)
            setIsListItemModalVisible(false)
            setSelectedProduct(null)
          }}
        />
      )}

    </View>
  )
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

