import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Search, ShoppingCart, Star, MapPin, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/context/AppContext';
import { mockServiceProviders } from '@/mocks/services';
import { ServiceCategory } from '@/types';
import Colors from '@/constants/colors';

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'mc', label: 'MC' },
  { id: 'comedian', label: 'Comedians' },
  { id: 'catering', label: 'Catering' },
  { id: 'photography', label: 'Photography' },
  { id: 'decoration', label: 'Decoration' },
];

export default function ServicesScreen() {
  const { cart } = useApp();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = mockServiceProviders.filter((provider) => {
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header with Gradient */}
      <LinearGradient
        colors={[Colors.primary + '08', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Services</Text>
            <Text style={styles.subtitle}>Book entertainers & vendors</Text>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/checkout' as any)}
            activeOpacity={0.7}
          >
            <ShoppingCart size={22} color={Colors.text} strokeWidth={2.5} />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Enhanced Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textSecondary} strokeWidth={2.5} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textTertiary}
        />
      </View>

      {/* Modern Category Chips */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
        <TouchableOpacity
          style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
          onPress={() => setSelectedCategory('all')}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.categoryChipText, selectedCategory === 'all' && styles.categoryChipTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
        </ScrollView>
      </View>

      {/* Enhanced Provider Cards */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.providersList}>
          {filteredProviders.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={styles.providerCard}
              onPress={() => router.push(`/booking/${provider.id}` as any)}
              activeOpacity={0.95}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: provider.imageUrl }} style={styles.providerImage} contentFit="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.imageGradient}
                >
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{CATEGORIES.find(c => c.id === provider.category)?.label}</Text>
                  </View>
                </LinearGradient>
              </View>

              <View style={styles.providerContent}>
                <View style={styles.providerHeader}>
                  <View style={styles.providerTitleContainer}>
                    <Text style={styles.providerName} numberOfLines={1}>{provider.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color={Colors.warning} fill={Colors.warning} strokeWidth={2} />
                      <Text style={styles.ratingText}>{provider.rating}</Text>
                      <Text style={styles.reviewsText}>({provider.reviews})</Text>
                    </View>
                  </View>
                  <ArrowUpRight size={20} color={Colors.textTertiary} strokeWidth={2} />
                </View>

                <Text style={styles.providerDescription} numberOfLines={2}>
                  {provider.description}
                </Text>

                <View style={styles.providerFooter}>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color={Colors.textSecondary} strokeWidth={2.5} />
                    <Text style={styles.location} numberOfLines={1}>{provider.location}</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>From</Text>
                    <Text style={styles.price}>₦{(provider.basePrice / 1000).toFixed(0)}K</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  cartButton: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  categoriesContainer: {
    marginBottom: 12,
    paddingBottom: 0,
    overflow: 'hidden',
  },
  categoriesScroll: {
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 0,
    marginBottom: 0,
    gap: 10,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 20,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    marginTop: 0,
    paddingTop: 0,
  },
  providersList: {
    paddingHorizontal: 20,
    paddingTop: 0,
    marginTop: 0,
    paddingBottom: 20,
    gap: 16,
  },
  providerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
  },
  providerImage: {
    width: '100%',
    height: 200,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-end',
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  providerContent: {
    padding: 18,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  providerName: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 2,
  },
  reviewsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  providerDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 16,
    fontWeight: '500' as const,
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 12,
  },
  location: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    flex: 1,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
});
