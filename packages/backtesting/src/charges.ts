export class RegulatoryCharges {
  // Indian NSE Equity F&O Regulatory Schedule
  public static calculateCharges(
    turnover: number,
    action: 'BUY' | 'SELL',
    brokerageFlat: number = 20.0
  ): { total: number; breakdown: Record<string, number> } {
    const brokerage = Math.min(20.0, brokerageFlat);
    // STT: 0.0625% on Option Sell turnover (premium turnover)
    const stt = action === 'SELL' ? Number((turnover * 0.000625).toFixed(2)) : 0.0;
    // Exchange Turnover Fee: 0.05% for NSE Options
    const exchangeTurnover = Number((turnover * 0.0005).toFixed(2));
    // GST: 18% on (Brokerage + Exchange Turnover Fee + SEBI charges)
    const gst = Number(((brokerage + exchangeTurnover) * 0.18).toFixed(2));
    // SEBI Charges: ₹10 per crore (0.0001%)
    const sebiCharges = Number((turnover * 0.000001).toFixed(2));
    // Stamp Duty: 0.003% on Buy side
    const stampDuty = action === 'BUY' ? Number((turnover * 0.00003).toFixed(2)) : 0.0;

    const total = Number((brokerage + stt + exchangeTurnover + gst + sebiCharges + stampDuty).toFixed(2));

    return {
      total,
      breakdown: {
        brokerage,
        stt,
        exchangeTurnover,
        gst,
        sebiCharges,
        stampDuty
      }
    };
  }
}

