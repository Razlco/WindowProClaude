import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Job } from '../types';
import { formatCurrency, formatDisplayDate } from '../utils';

class PDFService {
  async generateJobPDF(job: Job): Promise<string> {
    const html = this.createJobHTML(job);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    return uri;
  }

  async shareJobPDF(job: Job): Promise<void> {
    const pdfUri = await this.generateJobPDF(job);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: `Job ${job.jobNumber} - ${job.customer.name}`,
      });
    }
  }

  private createJobHTML(job: Job): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Job ${job.jobNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <h1>Job Estimate</h1>
          <p><strong>Job Number:</strong> ${job.jobNumber}</p>
          <p><strong>Date:</strong> ${formatDisplayDate(job.createdAt)}</p>
          <p><strong>Status:</strong> ${job.status}</p>

          <h2>Customer Information</h2>
          <p><strong>Name:</strong> ${job.customer.name}</p>
          <p><strong>Phone:</strong> ${job.customer.phone}</p>
          <p><strong>Address:</strong> ${job.customer.address}, ${job.customer.city}, ${job.customer.state} ${job.customer.zipCode}</p>

          <h2>Measurements</h2>
          <table>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
            ${job.pricing.itemizedCosts.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.unitPrice)}</td>
                <td>${formatCurrency(item.subtotal)}</td>
              </tr>
            `).join('')}
          </table>

          <h2>Pricing Summary</h2>
          <p><strong>Subtotal:</strong> ${formatCurrency(job.pricing.subtotal)}</p>
          <p><strong>Tax (${(job.pricing.taxRate * 100).toFixed(1)}%):</strong> ${formatCurrency(job.pricing.tax)}</p>
          <p class="total"><strong>Total:</strong> ${formatCurrency(job.pricing.total)}</p>
        </body>
      </html>
    `;
  }
}

export default new PDFService();
