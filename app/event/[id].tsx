import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, MapPin, Trash2, QrCode, Users, Wallet, TrendingDown, X } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, deleteEvent, getEventAttendees } = useApp();
  const router = useRouter();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const event = events.find((e) => e.id === id);
  const attendees = getEventAttendees(id);

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEvent(id);
          router.back();
        },
      },
    ]);
  };

  const handleWithdrawal = () => {
    const revenue = event.revenue;
    const withdrawalFee = revenue * 0.05;
    const amountToReceive = revenue - withdrawalFee;

    Alert.alert(
      'Confirm Withdrawal',
      `Are you sure you want to withdraw ₦${amountToReceive.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'default',
          onPress: () => {
            Alert.alert('Success', `₦${amountToReceive.toLocaleString()} has been sent to your account.`);
            setShowWithdrawModal(false);
            // Here you would typically call an API to process the withdrawal
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: event.imageUrl }} style={styles.headerImage} contentFit="cover" />

        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                {new Date(event.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                • {event.time}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={20} color={Colors.primary} />
              <Text style={styles.infoText}>{event.location}</Text>
            </View>
          </View>

          {event.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{event.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticket Types</Text>
            {event.ticketTypes.map((ticket) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketName}>{ticket.name}</Text>
                  <Text style={styles.ticketPrice}>
                    {ticket.price === 0 ? 'Free' : `₦${ticket.price.toLocaleString()}`}
                  </Text>
                </View>
                <View style={styles.ticketProgress}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(ticket.sold / ticket.quantity) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.ticketSold}>
                    {ticket.sold}/{ticket.quantity} sold
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Revenue & Withdrawal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Revenue</Text>
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={() => setShowWithdrawModal(true)}
              activeOpacity={0.7}
              disabled={event.revenue === 0}
            >
              <TrendingDown size={20} color="#fff" strokeWidth={2.5} />
              <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
            </TouchableOpacity>
          </View>

          {/* Withdrawal Modal */}
          <Modal
            visible={showWithdrawModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowWithdrawModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Withdraw Funds</Text>
                  <TouchableOpacity
                    onPress={() => setShowWithdrawModal(false)}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                  >
                    <X size={24} color={Colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.revenueCard}>
                  <View style={styles.revenueHeader}>
                    <View style={styles.revenueIconContainer}>
                      <Wallet size={24} color={Colors.success} strokeWidth={2.5} />
                    </View>
                    <View style={styles.revenueInfo}>
                      <Text style={styles.revenueLabel}>Total Revenue</Text>
                      <Text style={styles.revenueAmount}>₦{event.revenue.toLocaleString()}</Text>
                    </View>
                  </View>

                  <View style={styles.revenueDivider} />

                  <View style={styles.withdrawalInfo}>
                    <View style={styles.withdrawalRow}>
                      <Text style={styles.withdrawalLabel}>Withdrawal Fee (5%)</Text>
                      <Text style={styles.withdrawalFee}>-₦{(event.revenue * 0.05).toLocaleString()}</Text>
                    </View>
                    <View style={styles.withdrawalRow}>
                      <Text style={styles.withdrawalLabel}>You'll Receive</Text>
                      <Text style={styles.withdrawalAmount}>₦{(event.revenue * 0.95).toLocaleString()}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.withdrawButton}
                    onPress={handleWithdrawal}
                    activeOpacity={0.7}
                    disabled={event.revenue === 0}
                  >
                    <TrendingDown size={20} color="#fff" strokeWidth={2.5} />
                    <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Attendees ({attendees.length})</Text>
              <TouchableOpacity
                style={styles.checkInButton}
                onPress={() => router.push(`/checkin/${event.id}` as any)}
                activeOpacity={0.7}
              >
                <QrCode size={18} color="#fff" />
                <Text style={styles.checkInButtonText}>Check-in</Text>
              </TouchableOpacity>
            </View>

            {attendees.length === 0 ? (
              <View style={styles.emptyAttendees}>
                <Users size={40} color={Colors.textTertiary} strokeWidth={1.5} />
                <Text style={styles.emptyAttendeesText}>No attendees yet</Text>
              </View>
            ) : (
              <View style={styles.attendeesList}>
                {attendees.slice(0, 5).map((attendee) => (
                  <View key={attendee.id} style={styles.attendeeCard}>
                    <View style={styles.attendeeInfo}>
                      <Text style={styles.attendeeName}>{attendee.name}</Text>
                      <Text style={styles.attendeeEmail}>{attendee.email}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        attendee.checkedIn
                          ? styles.checkedInBadge
                          : styles.notCheckedInBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          attendee.checkedIn
                            ? styles.checkedInText
                            : styles.notCheckedInText,
                        ]}
                      >
                        {attendee.checkedIn ? 'Checked In' : 'Not Checked In'}
                      </Text>
                    </View>
                  </View>
                ))}
                {attendees.length > 5 && (
                  <Text style={styles.moreAttendees}>+{attendees.length - 5} more</Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Trash2 size={20} color={Colors.error} />
              <Text style={styles.deleteButtonText}>Delete Event</Text>
            </TouchableOpacity>
          </View>
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
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  ticketCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  ticketProgress: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  ticketSold: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  emptyAttendees: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyAttendeesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  attendeesList: {
    gap: 12,
  },
  attendeeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  attendeeEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  checkedInBadge: {
    backgroundColor: Colors.success + '20',
  },
  notCheckedInBadge: {
    backgroundColor: Colors.textTertiary + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  checkedInText: {
    color: Colors.success,
  },
  notCheckedInText: {
    color: Colors.textSecondary,
  },
  moreAttendees: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginTop: 8,
  },
  actions: {
    marginTop: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error + '15',
    borderWidth: 1,
    borderColor: Colors.error,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  revenueCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  revenueIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueInfo: {
    flex: 1,
  },
  revenueLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.success,
    letterSpacing: -0.5,
  },
  revenueDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  withdrawalInfo: {
    gap: 12,
    marginBottom: 20,
  },
  withdrawalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  withdrawalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  withdrawalFee: {
    fontSize: 15,
    color: Colors.error,
    fontWeight: '600' as const,
  },
  withdrawalAmount: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700' as const,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: Colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
