/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef } from "react";
import { Document } from "@/types/document.types";

// ── Number to French words ─────────────────────────────────────
const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const tens  = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

function belowHundred(n: number): string {
  if (n < 20) return units[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (t === 7 || t === 9) return tens[t] + (u === 1 && t === 7 ? "-et-" : "-") + units[10 + u];
  if (u === 1 && t !== 8) return tens[t] + "-et-un";
  if (u === 0) return tens[t] + (t === 8 ? "s" : "");
  return tens[t] + "-" + units[u];
}

function belowThousand(n: number): string {
  if (n < 100) return belowHundred(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const prefix = h === 1 ? "cent" : units[h] + " cent";
  if (r === 0) return h === 1 ? "cent" : units[h] + " cents";
  return prefix + " " + belowHundred(r);
}

function numberToFrench(amount: number): string {
  const totalMillimes = Math.round(amount * 1000);
  const dinars   = Math.floor(totalMillimes / 1000);
  const millimes = totalMillimes % 1000;

  let result = "";
  if (dinars === 0) {
    result = "zéro dinar";
  } else if (dinars < 1000) {
    result = belowThousand(dinars) + (dinars > 1 ? " dinars" : " dinar");
  } else {
    const thousands = Math.floor(dinars / 1000);
    const remainder = dinars % 1000;
    const tPrefix   = thousands === 1 ? "mille" : belowThousand(thousands) + " mille";
    result = remainder === 0
      ? tPrefix + (dinars > 1 ? " dinars" : " dinar")
      : tPrefix + " " + belowThousand(remainder) + " dinars";
  }

  if (millimes > 0) {
    result += " et " + belowThousand(millimes) + " millimes";
  }

  return result.charAt(0).toUpperCase() + result.slice(1);
}

// ── Component ──────────────────────────────────────────────────
interface DevisPrintProps {
  devis: Document & { tier?: any };
}

export default function DevisPrint({ devis }: DevisPrintProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const totalHT       = Number(devis.totalHT);
  const tva           = Number(devis.tva);
  const tvaAmt        = tva > 0 ? totalHT * (tva / 100) : 0;
  const droitDeTimbre = tva > 0 && devis.currency === "TND" ? 1 : 0;
  const totalTTC      = totalHT + tvaAmt + droitDeTimbre;
  const amountInWords = numberToFrench(totalTTC);
  const tier          = devis.tier ?? {};

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Devis ${devis.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #1a1a2e;
      background: #fff;
      padding: 0;
    }

    .page {
      width: 210mm;
      
      margin: 0 auto;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ── */
    .header {
      background: #f7f7f9;
      padding: 28px 40px 22px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #FBAE17;
    }

    .header-logo img {
      height: 48px;
      object-fit: contain;
    }

    .header-right {
      text-align: right;
    }

    .header-right h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .header-right .doc-ref {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }

    .header-right .doc-date {
      font-size: 11px;
      color: #444;
      margin-top: 2px;
    }

    /* ── Body ── */
    .body {
      flex: 1;
      padding: 20px 40px;
    }

    /* ── Client info ── */
    .info-row {
      display: flex;
      gap: 16px;
      margin-bottom: 18px;
    }

    .client-box {
      background: #f7f7f9;
      border-left: 3px solid #FBAE17;
      border-radius: 6px;
      padding: 16px 20px;
      flex: 1;
    }

    .client-box.seller {
      border-left-color: #1a1a2e;
    }

    .client-box h3 {
      font-size: 10px;
      font-weight: 600;
      color: #1a1a2e;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
    }

    .client-row {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
      font-size: 11px;
    }

    .client-label {
      color: #1a1a2e;
      font-weight: 600;
      min-width: 70px;
    }

    .client-value {
      color: #333;
    }

    /* ── Table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 11px;
    }

    thead tr {
      background: #1a1a2e;
    }

    thead th {
      padding: 10px 12px;
      text-align: left;
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #fff;
    }

    thead th:last-child,
    thead th:nth-child(3),
    thead th:nth-child(4) {
      text-align: right;
    }

    tbody tr {
      border-bottom: 1px solid #eee;
    }

    tbody tr:nth-child(even) {
      background: #fafafa;
    }

    tbody td {
      padding: 10px 12px;
      color: #333;
      vertical-align: top;
    }

    tbody td:nth-child(1) {
      color: #999;
      font-weight: 600;
      width: 32px;
    }

    tbody td:nth-child(3),
    tbody td:nth-child(4),
    tbody td:nth-child(5) {
      text-align: right;
    }

    /* ── Bottom section ── */
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      margin-top: 4px;
    }

    .arrête {
      flex: 1;
      padding-top: 4px;
    }

    .arrête-label {
      font-size: 10px;
      color: #1a1a2e;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }

    .arrête-text {
      font-size: 12px;
      color: #333;
      font-style: italic;
      line-height: 1.5;
    }

    /* ── Totals box ── */
    .totals-box {
      background: #f7f7f9;
      border-radius: 8px;
      padding: 16px 20px;
      min-width: 240px;
      border: 1px solid #eee;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      font-size: 11px;
      color: #555;
      border-bottom: 1px solid #eee;
    }

    .totals-row:last-child {
      border-bottom: none;
      padding-top: 10px;
      margin-top: 4px;
    }

    .totals-row.total-ttc {
      font-size: 13px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .totals-row .label { color: #666; }
    .totals-row .value { font-weight: 600; color: #1a1a2e; }
    .totals-row.total-ttc .value { color: #1a1a2e; font-size: 14px; }

    /* ── Signature ── */
    .signature-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 40px;
    }

    .signature-box {
      text-align: center;
      min-width: 180px;
    }

    .signature-label {
      font-size: 10px;
      color: #1a1a2e;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 40px;
    }

    .signature-line {
      border-top: 1.5px solid #ddd;
      width: 100%;
    }

    /* ── Footer — fixed to bottom of every printed page ── */
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1.5px solid #eee;
      padding: 14px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f7f7f9;
      font-size: 9.5px;
      color: #888;
      gap: 12px;
    }

    .footer-logo img {
      height: 28px;
      opacity: 0.85;
    }

    .footer-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }

    .footer-item-icon {
      width: 28px;
      height: 28px;
      background: #1a1a2e;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .footer-item-icon svg {
      width: 13px;
      height: 13px;
      stroke: #FBAE17;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .footer-item-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .footer-item-text .label {
      font-weight: 700;
      font-size: 9px;
      color: #1a1a2e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .footer-item-text .value {
      font-size: 9px;
      color: #666;
    }

    .footer-divider {
      width: 1px;
      height: 28px;
      background: #ddd;
    }

    @media print {
      body { padding: 0; }
      .page { width: 100%; }
      .footer { position: fixed; bottom: 0; left: 0; right: 0; }
    }

    /* Space at bottom so content never hides behind the fixed footer */
    .body { padding-bottom: 70px !important; }
  </style>
</head>
<body>
  ${content}
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`);
    win.document.close();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <>
      {/* Hidden print template */}
      <div ref={printRef} style={{ display: "none" }}>
        <div className="page">

          {/* Header */}
          <div className="header">
            <div className="header-logo">
              <img
                src="/logo-dark.png"
                alt="Brandbox"
              />
            </div>
            <div className="header-right">
              <h1>Devis</h1>
              <div className="doc-ref">{devis.id}</div>
              <div className="doc-date">Date : {formatDate(devis.date)}</div>
              {devis.dueDate && (
                <div className="doc-date">Échéance : {formatDate(devis.dueDate)}</div>
              )}
            </div>
          </div>

          <div className="body">

            {/* Seller + Buyer side by side */}
            <div className="info-row">

              {/* Seller — Brandbox */}
              <div className="client-box seller">
                <h3>Vendeur</h3>
                <div className="client-row">
                  <span className="client-label">Société :</span>
                  <span className="client-value">Brandbox Agency</span>
                </div>
                <div className="client-row">
                  <span className="client-label">M/F :</span>
                  <span className="client-value">1605746/G/M/000</span>
                </div>
                <div className="client-row">
                  <span className="client-label">Tél :</span>
                  <span className="client-value">+216 31 427 727 / +216 56 282 856</span>
                </div>
                <div className="client-row">
                  <span className="client-label">Email :</span>
                  <span className="client-value">contact@brandbox.tn</span>
                </div>
                <div className="client-row">
                  <span className="client-label">Adresse :</span>
                  <span className="client-value">Rue Slayem Ammar Sahloul 1, 4054 Sousse, Tunisie</span>
                </div>
                <div className="client-row">
                  <span className="client-label">RIB :</span>
                  <span className="client-value">08902000161001814557</span>
                </div>
              </div>

              {/* Buyer — Client */}
              <div className="client-box">
                <h3>Informations client</h3>
                <div className="client-row">
                  <span className="client-label">Client :</span>
                  <span className="client-value">{tier.name ?? "—"}</span>
                </div>
                {tier.mf && (
                  <div className="client-row">
                    <span className="client-label">M/F :</span>
                    <span className="client-value">{tier.mf}</span>
                  </div>
                )}
                {tier.phone && (
                  <div className="client-row">
                    <span className="client-label">Téléphone :</span>
                    <span className="client-value">{tier.phone}</span>
                  </div>
                )}
                {tier.address && (
                  <div className="client-row">
                    <span className="client-label">Adresse :</span>
                    <span className="client-value">{tier.address}</span>
                  </div>
                )}
              </div>

            </div>

            {/* Designations table */}
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Prix HT</th>
                </tr>
              </thead>
              <tbody>
                {(devis.designations ?? []).map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>{d.description}</td>
                    <td style={{ textAlign: "right" }}>
                      {Number(d.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 3 })}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {Number(d.unitPrice).toLocaleString("fr-FR", { minimumFractionDigits: 3 })}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {Number(d.total).toLocaleString("fr-FR", { minimumFractionDigits: 3 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom: arrête + totals */}
            <div className="bottom">
              <div className="arrête">
                <div className="arrête-label">Arrêté le présent devis à la somme de :</div>
                <div className="arrête-text">{amountInWords}</div>
              </div>

              <div className="totals-box">
                <div className="totals-row">
                  <span className="label">Total HT :</span>
                  <span className="value">
                    {totalHT.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {devis.currency}
                  </span>
                </div>
                {tva > 0 && (
                  <>
                    <div className="totals-row">
                      <span className="label">Taux TVA :</span>
                      <span className="value">{tva}%</span>
                    </div>
                    <div className="totals-row">
                      <span className="label">Montant TVA :</span>
                      <span className="value">
                        {tvaAmt.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {devis.currency}
                      </span>
                    </div>
                  </>
                )}
                {droitDeTimbre > 0 && (
                  <div className="totals-row">
                    <span className="label">Timbre fiscal :</span>
                    <span className="value">1.000 TND</span>
                  </div>
                )}
                <div className="totals-row total-ttc">
                  <span className="label">Montant TTC :</span>
                  <span className="value">
                    {totalTTC.toLocaleString("fr-FR", { minimumFractionDigits: 3 })} {devis.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="signature-row">
              <div className="signature-box">
                <div className="signature-label">Signature et Cachet</div>
                <div className="signature-line" />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="footer">
            <div className="footer-logo">
              <img src="/logo-dark.png" alt="Brandbox" />
            </div>
            <div className="footer-divider" />

            {/* Phone */}
            <div className="footer-item">
              <div className="footer-item-icon">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="footer-item-text">
                <span className="label">Téléphone</span>
                <span className="value">+216 31 427 727</span>
                <span className="value">+216 56 282 856</span>
              </div>
            </div>
            <div className="footer-divider" />

            {/* Email */}
            <div className="footer-item">
              <div className="footer-item-icon">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className="footer-item-text">
                <span className="label">Contact</span>
                <span className="value">contact@brandbox.tn</span>
                <span className="value">www.brandbox.tn</span>
              </div>
            </div>
            <div className="footer-divider" />

            {/* Address */}
            <div className="footer-item">
              <div className="footer-item-icon">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="footer-item-text">
                <span className="label">Adresse</span>
                <span className="value">Rue Slayem Ammar Sahloul 1</span>
                <span className="value">4054 Sousse, Tunisie</span>
              </div>
            </div>
            <div className="footer-divider" />

            {/* MF / RIB */}
            <div className="footer-item">
              <div className="footer-item-icon">
                <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              <div className="footer-item-text">
                <span className="label">MF / RIB</span>
                <span className="value">1605746/G/M/000</span>
                <span className="value">08902000161001814557</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Print button */}
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 rounded-xl bg-[#FBAE17] px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
        </svg>
        Imprimer
      </button>
    </>
  );
}