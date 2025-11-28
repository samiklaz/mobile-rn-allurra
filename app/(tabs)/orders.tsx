import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CheckCircle, XCircle, RefreshCcw } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

export default function OrdersScreen() {
  const { bookings, updateBookingStatus } = useApp();

  const handleRequestRefund = (bookingId: string) => {
    updateBookingStatus(bookingId, 'refunded');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>Track your bookings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Clock size={56} color={Colors.textTertiary} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
            <Text style={styles.emptyStateText}>
              Your service bookings will appear here once you make a purchase
            </Text>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {bookings.map((booking) => (
              <View key={booking.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.providerName}>{booking.provider.name}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          booking.status === 'accepted'
                            ? Colors.success + '20'
                            : booking.status === 'rejected'
                            ? Colors.error + '20'
                            : booking.status === 'refunded'
                            ? Colors.textTertiary + '20'
                            : Colors.warning + '20',
                      },
                    ]}
                  >
                    {booking.status === 'accepted' && <CheckCircle size={14} color={Colors.success} />}
                    {booking.status === 'rejected' && <XCircle size={14} color={Colors.error} />}
                    {booking.status === 'pending' && <Clock size={14} color={Colors.warning} />}
                    {booking.status === 'refunded' && <RefreshCcw size={14} color={Colors.textSecondary} />}
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            booking.status === 'accepted'
                              ? Colors.success
                              : booking.status === 'rejected'
                              ? Colors.error
                              : booking.status === 'refunded'
                              ? Colors.textSecondary
                              : Colors.warning,
                        },
                      ]}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.providerCategory}>
                  {booking.provider.category.charAt(0).toUpperCase() + booking.provider.category.slice(1)}
                </Text>

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Event Date:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(booking.eventDate).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>
                      {booking.location}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bid Amount:</Text>
                    <Text style={styles.detailAmount}>₦{booking.bidAmount.toLocaleString()}</Text>
                  </View>
                </View>

                {booking.status === 'rejected' && (
                  <TouchableOpacity
                    style={styles.refundButton}
                    onPress={() => handleRequestRefund(booking.id)}
                    activeOpacity={0.7}
                  >
                    <RefreshCcw size={16} color="#fff" />
                    <Text style={styles.refundButtonText}>Request Refund</Text>
                  </TouchableOpacity>
                )}

                <Text style={styles.orderDate}>
                  Booked on{' '}
                  {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  ordersList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  providerCategory: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    fontWeight: '500' as const,
  },
  orderDetails: {
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600' as const,
    flex: 1,
    textAlign: 'right',
  },
  detailAmount: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  refundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    marginBottom: 12,
  },
  refundButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
});
