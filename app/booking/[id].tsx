import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, MapPin, Star, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { mockServiceProviders } from '@/mocks/services';
import Colors from '@/constants/colors';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useApp();
  const router = useRouter();
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const provider = mockServiceProviders.find((p) => p.id === id);

  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service provider not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (!eventDate || !location || !bidAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < provider.basePrice) {
      Alert.alert('Error', `Bid amount must be at least ₦${provider.basePrice.toLocaleString()}`);
      return;
    }

    addToCart({
      providerId: provider.id,
      provider,
      eventDate,
      location,
      bidAmount: amount,
    });

    Alert.alert('Success', 'Added to cart', [
      {
        text: 'View Cart',
        onPress: () => router.push('/checkout' as any),
      },
      {
        text: 'Continue Shopping',
        style: 'cancel',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: provider.imageUrl }} style={styles.headerImage} contentFit="cover" />

        <View style={styles.content}>
          <Text style={styles.category}>
            {provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}
          </Text>
          <Text style={styles.title}>{provider.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.rating}>
              <Star size={16} color="#FFA500" fill="#FFA500" />
              <Text style={styles.ratingText}>{provider.rating}</Text>
              <Text style={styles.reviewsText}>({provider.reviews} reviews)</Text>
            </View>
            <View style={styles.locationBadge}>
              <MapPin size={14} color={Colors.textSecondary} />
              <Text style={styles.locationText}>{provider.location}</Text>
            </View>
          </View>

          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Base Price</Text>
            <Text style={styles.price}>₦{provider.basePrice.toLocaleString()}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{provider.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Details</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Event Date <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Calendar size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={eventDate}
                  onChangeText={setEventDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Location <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <MapPin size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter event location"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Your Bid Amount <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₦</Text>
                <TextInput
                  style={styles.input}
                  value={bidAmount}
                  onChangeText={setBidAmount}
                  placeholder={provider.basePrice.toString()}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              <Text style={styles.hint}>Minimum bid: ₦{provider.basePrice.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              1. Add your booking details and bid amount{'\n'}
              2. Complete payment to submit your request{'\n'}
              3. Service provider will review and accept/reject{'\n'}
              4. You can request a refund if rejected
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.7}
        >
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  reviewsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  priceCard: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  price: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    gap: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  hint: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
