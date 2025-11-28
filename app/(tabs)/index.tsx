import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Plus, TrendingUp, Calendar, DollarSign, Sparkles, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const { events, isLoading, getTotalRevenue } = useApp();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const totalRevenue = getTotalRevenue();
  const totalEvents = events.length;
  const totalTicketsSold = events.reduce(
    (sum, event) => sum + event.ticketTypes.reduce((s, tt) => s + tt.sold, 0),
    0
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Gradient Background */}
        <LinearGradient
          colors={[Colors.primary + '08', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back! ✨</Text>
              <Text style={styles.subtitle}>Manage your events & tickets</Text>
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/event/create' as any)}
              activeOpacity={0.7}
            >
              <Plus size={20} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Modern Stats Cards with Improved Layout */}
        <View style={styles.statsContainer}>
          <View style={styles.statCardLarge}>
            <View style={styles.statCardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '15' }]}>
                <DollarSign size={24} color={Colors.primary} strokeWidth={2.5} />
              </View>
              <TrendingUp size={16} color={Colors.success} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValueLarge}>₦{(totalRevenue / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCardSmall}>
              <View style={[styles.iconContainerSmall, { backgroundColor: '#8B5CF6' + '15' }]}>
                <Calendar size={20} color="#8B5CF6" strokeWidth={2.5} />
              </View>
              <Text style={styles.statValueSmall}>{totalEvents}</Text>
              <Text style={styles.statLabelSmall}>Events</Text>
            </View>

            <View style={styles.statCardSmall}>
              <View style={[styles.iconContainerSmall, { backgroundColor: '#F59E0B' + '15' }]}>
                <TrendingUp size={20} color="#F59E0B" strokeWidth={2.5} />
              </View>
              <Text style={styles.statValueSmall}>{totalTicketsSold}</Text>
              <Text style={styles.statLabelSmall}>Tickets Sold</Text>
            </View>
          </View>
        </View>

        {/* Events Section with Enhanced Design */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Your Events</Text>
              <Text style={styles.sectionSubtitle}>{events.length} {events.length === 1 ? 'event' : 'events'} in total</Text>
            </View>
          </View>

          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={[Colors.primary + '08', 'transparent']}
                style={styles.emptyStateGradient}
              >
                <View style={styles.emptyIconContainer}>
                  <Sparkles size={48} color={Colors.primary} strokeWidth={2} />
                </View>
                <Text style={styles.emptyStateTitle}>Start Your Journey</Text>
                <Text style={styles.emptyStateText}>
                  Create your first event and begin managing tickets, attendees, and revenue all in one place
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/event/create' as any)}
                  activeOpacity={0.7}
                >
                  <Plus size={22} color="#fff" strokeWidth={2.5} />
                  <Text style={styles.emptyStateButtonText}>Create Your First Event</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.eventsList}>
              {events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => router.push(`/event/${event.id}` as any)}
                  activeOpacity={0.95}
                >
                  <View style={styles.eventImageContainer}>
                    <Image
                      source={{ uri: event.imageUrl }}
                      style={styles.eventImage}
                      contentFit="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.7)']}
                      style={styles.eventImageGradient}
                    >
                      <View style={styles.eventBadge}>
                        <Calendar size={12} color="#fff" strokeWidth={2.5} />
                        <Text style={styles.eventBadgeText}>
                          {new Date(event.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>

                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <View style={styles.eventTitleContainer}>
                        <Text style={styles.eventTitle} numberOfLines={1}>
                          {event.title}
                        </Text>
                        <Text style={styles.eventTime}>{event.time}</Text>
                      </View>
                      <ArrowUpRight size={20} color={Colors.textTertiary} strokeWidth={2} />
                    </View>

                    <Text style={styles.eventLocation} numberOfLines={1}>
                      📍 {event.location}
                    </Text>

                    <View style={styles.eventFooter}>
                      <View style={styles.eventStat}>
                        <Text style={styles.eventRevenue}>₦{event.revenue.toLocaleString()}</Text>
                        <Text style={styles.eventRevenueLabel}>Revenue</Text>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.eventStat}>
                        <Text style={styles.eventTickets}>
                          {event.ticketTypes.reduce((s, tt) => s + tt.sold, 0)}/{event.ticketTypes.reduce((s, tt) => s + tt.quantity, 0)}
                        </Text>
                        <Text style={styles.eventTicketsLabel}>Sold</Text>
                      </View>

                      <View style={styles.progressBarContainer}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${(event.ticketTypes.reduce((s, tt) => s + tt.sold, 0) /
                                Math.max(event.ticketTypes.reduce((s, tt) => s + tt.quantity, 0), 1)) * 100}%`
                            }
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greeting: {
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
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCardLarge: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
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
        elevation: 2,
      },
    }),
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValueLarge: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardSmall: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
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
        elevation: 2,
      },
    }),
  },
  iconContainerSmall: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValueSmall: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabelSmall: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  emptyState: {
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateGradient: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  eventsList: {
    gap: 16,
  },
  eventCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
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
  eventImageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  eventImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    padding: 16,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    backdropFilter: 'blur(10px)',
  },
  eventBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  eventContent: {
    padding: 18,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  eventTime: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  eventLocation: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    marginBottom: 16,
  },
  eventFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  eventStat: {
    marginBottom: 12,
  },
  eventRevenue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  eventRevenueLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  eventTickets: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  eventTicketsLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
});
