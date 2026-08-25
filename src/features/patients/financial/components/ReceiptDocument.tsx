import path from "path";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const logoPath = path.join(
  process.cwd(),
  "public/brand/icon-square.png"
);

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },
  header: {
    marginBottom: 32,
    borderBottom: "2 solid #0248BF",
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 34,
    height: 34,
    marginRight: 12,
  },
  headerText: {
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0248BF",
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: "1 solid #e2e8f0",
  },
  label: {
    color: "#64748b",
  },
  value: {
    fontWeight: 700,
  },
  amountBox: {
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f0fdf4",
    borderRadius: 4,
  },
  amountLabel: {
    fontSize: 10,
    color: "#166534",
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#166534",
    marginTop: 4,
  },
  declaration: {
    marginTop: 24,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  signature: {
    marginTop: 64,
    borderTop: "1 solid #0f172a",
    paddingTop: 8,
    width: 260,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
  },
});

interface ReceiptDocumentProps {
  clinicName: string;
  patientName: string;
  description: string;
  amount: string;
  paidAt: string;
  method: string;
  receiptNumber: string;
}

export default function ReceiptDocument({
  clinicName,
  patientName,
  description,
  amount,
  paidAt,
  method,
  receiptNumber,
}: ReceiptDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        <View style={styles.header}>
          <Image style={styles.logo} src={logoPath} />

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Recibo de Pagamento
            </Text>

            <Text style={styles.subtitle}>
              {clinicName} · Recibo Nº{" "}
              {receiptNumber}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Paciente
          </Text>

          <Text style={styles.value}>
            {patientName}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Referente a
          </Text>

          <Text style={styles.value}>
            {description}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Data do pagamento
          </Text>

          <Text style={styles.value}>
            {paidAt}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Forma de pagamento
          </Text>

          <Text style={styles.value}>
            {method}
          </Text>
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>
            Valor recebido
          </Text>

          <Text style={styles.amountValue}>
            {amount}
          </Text>
        </View>

        <Text style={styles.declaration}>
          Declaro, para os devidos fins, ter
          recebido de {patientName} a quantia
          acima referente a {description}.
        </Text>

        <View style={styles.signature}>
          <Text>{clinicName}</Text>
        </View>

        <Text style={styles.footer}>
          Recibo gerado eletronicamente pelo
          OdontoFlow.
        </Text>

      </Page>
    </Document>
  );
}
