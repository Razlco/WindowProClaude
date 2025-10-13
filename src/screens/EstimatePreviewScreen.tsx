import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants';
// import * as Print from 'expo-print';
// import * as Sharing from 'expo-sharing';

const EstimatePreviewScreen = ({ navigation, route }: any) => {
  const { job } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(job?.customer?.email || '');
  const [recipientPhone, setRecipientPhone] = useState(job?.customer?.phone || '');
  const [emailMessage, setEmailMessage] = useState('');

  // TODO: Backend developer - Fetch PDF pricing preference from settings
  const [detailedPricing, setDetailedPricing] = useState(true);

  const generatePDFContent = () => {
    // TODO: Backend developer - Replace with actual job data and implement full PDF template
    // This is a placeholder HTML template for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Helvetica', 'Arial', sans-serif;
              padding: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #2563EB;
              padding-bottom: 20px;
            }
            .company-name {
              font-size: 32px;
              font-weight: bold;
              color: #2563EB;
              margin-bottom: 10px;
            }
            .document-title {
              font-size: 24px;
              color: #666;
              margin-top: 10px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #2563EB;
              margin-bottom: 15px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #f0f0f0;
            }
            .info-label {
              font-weight: 600;
              color: #666;
            }
            .info-value {
              color: #333;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .table th {
              background-color: #2563EB;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
            }
            .table td {
              padding: 10px 12px;
              border-bottom: 1px solid #ddd;
            }
            .table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .pricing-summary {
              margin-top: 30px;
              padding: 20px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
            .pricing-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 16px;
            }
            .pricing-total {
              display: flex;
              justify-content: space-between;
              padding: 15px 0;
              margin-top: 15px;
              border-top: 3px solid #2563EB;
              font-size: 24px;
              font-weight: bold;
              color: #2563EB;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${job?.companyName || 'Your Company Name'}</div>
            <div>${job?.companyPhone || '(555) 123-4567'} | ${job?.companyEmail || 'info@company.com'}</div>
            <div class="document-title">ESTIMATE #${job?.jobNumber || 'XXXX'}</div>
          </div>

          <div class="section">
            <div class="section-title">Customer Information</div>
            <div class="info-row">
              <span class="info-label">Customer:</span>
              <span class="info-value">${job?.customer?.name || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${job?.customer?.phone || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${job?.customer?.email || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span class="info-value">${job?.customer?.address || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${new Date().toLocaleDateString()}</span>
            </div>
          </div>

          ${detailedPricing ? `
          <div class="section">
            <div class="section-title">Measurements & Line Items</div>
            <table class="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Dimensions</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${job?.measurements?.map((m: any, i: number) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${m.productType || 'Window'}</td>
                    <td>${m.width}" × ${m.height}"</td>
                    <td>${m.quantity || 1}</td>
                    <td>$${(m.unitPrice || 0).toFixed(2)}</td>
                    <td>$${(m.total || 0).toFixed(2)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="6">No measurements added</td></tr>'}
              </tbody>
            </table>
          </div>
          ` : ''}

          <div class="pricing-summary">
            ${detailedPricing ? `
            <div class="pricing-row">
              <span>Subtotal:</span>
              <span>$${(job?.pricing?.subtotal || 0).toFixed(2)}</span>
            </div>
            <div class="pricing-row">
              <span>Tax (${(job?.taxRate || 8).toFixed(1)}%):</span>
              <span>$${(job?.pricing?.tax || 0).toFixed(2)}</span>
            </div>
            ${job?.pricing?.discount > 0 ? `
            <div class="pricing-row">
              <span>Discount:</span>
              <span>-$${(job?.pricing?.discount || 0).toFixed(2)}</span>
            </div>
            ` : ''}
            ` : ''}
            <div class="pricing-total">
              <span>TOTAL:</span>
              <span>$${(job?.pricing?.total || 0).toFixed(2)}</span>
            </div>
          </div>

          ${job?.notes ? `
          <div class="section">
            <div class="section-title">Notes</div>
            <p>${job.notes}</p>
          </div>
          ` : ''}

          <div class="footer">
            <p>This estimate is valid for 30 days from the date above.</p>
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;
    return htmlContent;
  };

  const handleGeneratePDF = async () => {
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Backend developer - Implement actual PDF generation with expo-print
      // const { uri } = await Print.printToFileAsync({
      //   html: generatePDFContent(),
      //   base64: false,
      // });
      //
      // await Sharing.shareAsync(uri, {
      //   UTI: '.pdf',
      //   mimeType: 'application/pdf',
      // });

      // Temporary: Show success for UI demonstration
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'PDF generated and ready to share!');
        setLoading(false);
      }, 1500);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Email Required', 'Please enter a recipient email address.');
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Backend developer - Implement Supabase Edge Function to send email with PDF
      // const { error } = await supabase.functions.invoke('send-estimate-email', {
      //   body: {
      //     to: recipientEmail.trim(),
      //     subject: `Estimate #${job.jobNumber} from ${job.companyName}`,
      //     message: emailMessage || 'Please find your estimate attached.',
      //     pdfContent: generatePDFContent(),
      //     jobNumber: job.jobNumber,
      //   },
      // });
      //
      // if (error) throw error;

      // Temporary: Show success for UI demonstration
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Email Sent!',
          `Estimate has been sent to ${recipientEmail}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        setLoading(false);
      }, 1500);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Failed to send email. Please try again.');
      setLoading(false);
    }
  };

  const handleSendSMS = async () => {
    if (!recipientPhone.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Phone Required', 'Please enter a recipient phone number.');
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // TODO: Backend developer - Implement Supabase Edge Function to send SMS with link
      // Generate short link to PDF hosted on cloud storage
      // const { error } = await supabase.functions.invoke('send-estimate-sms', {
      //   body: {
      //     to: recipientPhone.trim(),
      //     message: `Estimate #${job.jobNumber} from ${job.companyName}. View: [SHORT_LINK]`,
      //     jobId: job.id,
      //   },
      // });
      //
      // if (error) throw error;

      // Temporary: Show success for UI demonstration
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'SMS Sent!',
          `Estimate link has been sent to ${recipientPhone}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        setLoading(false);
      }, 1500);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.message || 'Failed to send SMS. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estimate Preview</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container}>
        {/* Preview Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Preview</Text>

          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.companyName}>{job?.companyName || 'Your Company'}</Text>
              <Text style={styles.documentTitle}>ESTIMATE #{job?.jobNumber || 'XXXX'}</Text>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Customer:</Text>
              <Text style={styles.previewValue}>{job?.customer?.name || 'N/A'}</Text>
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Date:</Text>
              <Text style={styles.previewValue}>{new Date().toLocaleDateString()}</Text>
            </View>

            {detailedPricing ? (
              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>Items:</Text>
                <Text style={styles.previewValue}>
                  {job?.measurements?.length || 0} measurement(s)
                </Text>
              </View>
            ) : null}

            <View style={[styles.previewSection, styles.totalSection]}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalValue}>${(job?.pricing?.total || 0).toFixed(2)}</Text>
            </View>

            <View style={styles.pricingBadge}>
              <Text style={styles.pricingBadgeText}>
                {detailedPricing ? '📊 Detailed Pricing' : '💰 Total Only'}
              </Text>
            </View>
          </View>
        </View>

        {/* PDF Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Export Options</Text>

          <TouchableOpacity
            style={[styles.actionButton, loading && styles.actionButtonDisabled]}
            onPress={handleGeneratePDF}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>📥</Text>
            <Text style={styles.actionButtonText}>Download PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary, loading && styles.actionButtonDisabled]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Print', 'Print functionality will open system print dialog');
            }}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🖨️</Text>
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Print PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Send via Email */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📧 Send via Email</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Email</Text>
            <TextInput
              style={styles.input}
              value={recipientEmail}
              onChangeText={setRecipientEmail}
              placeholder="customer@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={emailMessage}
              onChangeText={setEmailMessage}
              placeholder="Add a personal message..."
              multiline
              numberOfLines={3}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.actionButtonDisabled]}
            onPress={handleSendEmail}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color={Colors.background} />
            ) : (
              <>
                <Text style={styles.sendButtonIcon}>✉️</Text>
                <Text style={styles.sendButtonText}>Send Email</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Send via SMS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Send via SMS</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Phone</Text>
            <TextInput
              style={styles.input}
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Customer will receive a text message with a secure link to view the estimate
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, styles.sendButtonSecondary, loading && styles.actionButtonDisabled]}
            onPress={handleSendSMS}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <>
                <Text style={styles.sendButtonIcon}>💬</Text>
                <Text style={[styles.sendButtonText, styles.sendButtonTextSecondary]}>Send SMS</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.background,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  previewSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  previewValue: {
    fontSize: 14,
    color: Colors.text,
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
    borderBottomWidth: 0,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  pricingBadge: {
    marginTop: 16,
    padding: 8,
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: 8,
    alignItems: 'center',
  },
  pricingBadgeText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonTextSecondary: {
    color: Colors.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoBox: {
    backgroundColor: Colors.backgroundGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
  },
  sendButtonSecondary: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  sendButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sendButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButtonTextSecondary: {
    color: Colors.primary,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default EstimatePreviewScreen;
