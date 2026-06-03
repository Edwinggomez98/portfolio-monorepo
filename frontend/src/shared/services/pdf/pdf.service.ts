import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Quote } from '../../../public/domain/models/quote/quote.model';

@Injectable({ providedIn: 'root' })
export class PdfService {

  async generateQuotePdf(quote: Quote): Promise<void> {
    const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W    = 210;
    const pad  = 15;
    const col2 = W / 2;

    const currencySymbol: Record<string, string> = { USD: '$', EUR: '€', VES: 'Bs.' };
    const sym = currencySymbol[quote.currency] ?? '$';

    const fmt = (n: number) => `${sym} ${n.toFixed(2)}`;
    const fmtDate = (d: string) => {
      if (!d) return '';
      const [y, m, day] = d.split('-');
      return `${day}/${m}/${y}`;
    };

    // ── Colores ──────────────────────────────────────────────────────────────
    const blue   : [number, number, number] = [37, 99, 235];
    const cyan   : [number, number, number] = [6,  182, 212];
    const dark   : [number, number, number] = [17, 24, 39];
    const gray   : [number, number, number] = [107, 114, 128];
    const light  : [number, number, number] = [243, 244, 246];
    const white  : [number, number, number] = [255, 255, 255];

    // ── Header ───────────────────────────────────────────────────────────────
    doc.setFillColor(...blue);
    doc.rect(0, 0, W, 38, 'F');

    doc.setFillColor(...cyan);
    doc.rect(0, 36, W, 3, 'F');

    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Edwing Gomez', pad, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Full Stack Developer', pad, 23);
    doc.text('Edwinggomez98@gmail.com  ·  +58 424-7597776', pad, 29);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(...white);
    doc.text('COTIZACIÓN', W - pad, 20, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`N°  ${quote.number}`, W - pad, 28, { align: 'right' });
    doc.text(`Fecha: ${fmtDate(quote.date)}`, W - pad, 33, { align: 'right' });

    // ── Info cliente + vigencia ───────────────────────────────────────────────
    let y = 48;
    doc.setTextColor(...dark);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DATOS DEL CLIENTE', pad, y);
    doc.text('VIGENCIA', col2 + 5, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...gray);

    const clientLines = [
      quote.client.name    ? `Nombre: ${quote.client.name}`    : '',
      quote.client.company ? `Empresa: ${quote.client.company}` : '',
      quote.client.email   ? `Email: ${quote.client.email}`    : '',
    ].filter(Boolean);

    clientLines.forEach(line => { doc.text(line, pad, y); y += 5; });

    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(`Válida hasta: ${fmtDate(quote.validUntil)}`, col2 + 5, 53);
    doc.text(`Moneda: ${quote.currency}`, col2 + 5, 58);

    // ── Tabla de ítems ────────────────────────────────────────────────────────
    y = Math.max(y, 72) + 4;

    // Cabecera de tabla
    doc.setFillColor(...blue);
    doc.rect(pad, y, W - pad * 2, 8, 'F');
    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    const cols = {
      idx:   pad + 2,
      desc:  pad + 12,
      qty:   pad + 100,
      price: pad + 120,
      sub:   pad + 148,
    };

    doc.text('#',          cols.idx,   y + 5.5);
    doc.text('Descripción', cols.desc,  y + 5.5);
    doc.text('Cant.',       cols.qty,   y + 5.5);
    doc.text('P. Unit.',    cols.price, y + 5.5);
    doc.text('Subtotal',    cols.sub,   y + 5.5);

    y += 8;
    doc.setFont('helvetica', 'normal');

    quote.items.forEach((item, idx) => {
      const rowBg = idx % 2 === 0 ? white : light;
      doc.setFillColor(...rowBg);
      doc.rect(pad, y, W - pad * 2, 8, 'F');

      doc.setTextColor(...dark);
      doc.setFontSize(8);
      doc.text(String(idx + 1),      cols.idx,   y + 5.5);
      doc.text(
        doc.splitTextToSize(item.description, 82)[0],
        cols.desc, y + 5.5
      );
      doc.text(String(item.quantity),            cols.qty,   y + 5.5);
      doc.text(fmt(item.unitPrice),              cols.price, y + 5.5);
      doc.text(fmt(item.subtotal),               cols.sub,   y + 5.5);

      y += 8;
    });

    // Borde inferior de tabla
    doc.setDrawColor(...cyan);
    doc.setLineWidth(0.5);
    doc.line(pad, y, W - pad, y);

    // ── Totales ───────────────────────────────────────────────────────────────
    y += 6;
    const totX  = W - pad - 55;
    const valX  = W - pad;

    const addTotal = (label: string, value: string, bold = false, highlight = false) => {
      if (highlight) {
        doc.setFillColor(...blue);
        doc.rect(totX - 5, y - 4, 55 + 5, 8, 'F');
        doc.setTextColor(...white);
      } else {
        doc.setTextColor(...dark);
      }
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(bold ? 10 : 9);
      doc.text(label, totX, y, { align: 'left' });
      doc.text(value, valX, y, { align: 'right' });
      y += 8;
    };

    addTotal('Subtotal:',                  fmt(quote.subtotal));
    addTotal(`IVA (${quote.taxRate}%):`,   fmt(quote.tax));
    addTotal('TOTAL:',                     fmt(quote.total), true, true);

    // ── Notas ─────────────────────────────────────────────────────────────────
    if (quote.notes) {
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...dark);
      doc.text('NOTAS:', pad, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...gray);
      const noteLines = doc.splitTextToSize(quote.notes, W - pad * 2);
      doc.text(noteLines, pad, y);
      y += noteLines.length * 5;
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    const footerY = 287;
    doc.setFillColor(...light);
    doc.rect(0, footerY - 6, W, 16, 'F');
    doc.setFillColor(...cyan);
    doc.rect(0, footerY - 6, W, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...gray);
    doc.text('Este documento es una cotización y no constituye una factura legal.', W / 2, footerY, { align: 'center' });
    doc.text(`Generado el ${fmtDate(quote.date)} · edwinggomez.vercel.app`, W / 2, footerY + 5, { align: 'center' });

    // ── Guardar ───────────────────────────────────────────────────────────────
    doc.save(`Cotizacion-${quote.number}.pdf`);
  }
}
