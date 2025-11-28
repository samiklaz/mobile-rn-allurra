import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

export default function CreateEventScreen() {
  const { addEvent } = useApp();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    ticketTypes: [{ name: 'General Admission', price: '0', quantity: '100' }],
  });

  const addTicketType = () => {
    setFormData({
      ...formData,
      ticketTypes: [...formData.ticketTypes, { name: '', price: '0', quantity: '0' }],
    });
  };

  const updateTicketType = (index: number, field: string, value: string) => {
    const updated = [...formData.ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ticketTypes: updated });
  };

  const removeTicketType = (index: number) => {
    if (formData.ticketTypes.length > 1) {
      const updated = formData.ticketTypes.filter((_, i) => i !== index);
      setFormData({ ...formData, ticketTypes: updated });
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addEvent({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      imageUrl: formData.imageUrl,
      ticketTypes: formData.ticketTypes.map((tt, index) => ({
        id: `ticket_${Date.now()}_${index}`,
        name: tt.name || 'Ticket',
        price: parseFloat(tt.price) || 0,
        quantity: parseInt(tt.quantity) || 0,
        sold: 0,
      })),
    });

    Alert.alert('Success', 'Event created successfully', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Event Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter event title"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe your event"
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.flex1]}>
              <Text style={styles.label}>
                Date <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            <View style={[styles.formGroup, styles.flex1]}>
              <Text style={styles.label}>
                Time <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
                placeholder="HH:MM AM/PM"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Location <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="Enter event location"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={formData.imageUrl}
              onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
              placeholder="Enter image URL"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticket Types</Text>
            {formData.ticketTypes.map((ticket, index) => (
              <View key={index} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketNumber}>Ticket {index + 1}</Text>
                  {formData.ticketTypes.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeTicketType(index)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeButton}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={ticket.name}
                    onChangeText={(text) => updateTicketType(index, 'name', text)}
                    placeholder="e.g., VIP, Regular"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, styles.flex1]}>
                    <Text style={styles.label}>Price (₦)</Text>
                    <TextInput
                      style={styles.input}
                      value={ticket.price}
                      onChangeText={(text) => updateTicketType(index, 'price', text)}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>

                  <View style={[styles.formGroup, styles.flex1]}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      value={ticket.quantity}
                      onChangeText={(text) => updateTicketType(index, 'quantity', text)}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addTicketType} activeOpacity={0.7}>
              <Text style={styles.addButtonText}>+ Add Ticket Type</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>Create Event</Text>
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
  form: {
    padding: 20,
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  section: {
    gap: 12,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  ticketCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketNumber: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  removeButton: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  addButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
