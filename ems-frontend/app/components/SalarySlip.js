'use client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalarySlip({ employee, salaryData }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 185);
    doc.text('Salary Slip', 15, 20);

    // Company Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Your Company Name', 15, 30);
    doc.text('123 Business Street, City', 15, 35);

    // Employee Info
    autoTable(doc, {
      startY: 45,
      head: [['Employee ID', 'Name', 'Position', 'Department']],
      body: [[
        employee.id,
        `${employee.firstName} ${employee.lastName}`,
        employee.position,
        employee.department
      ]],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });

    // Salary Details
    autoTable(doc, {
      startY: 75,
      head: [['Earnings', 'Amount (₹)', 'Deductions', 'Amount (₹)']],
      body: [
        ['Basic Pay', salaryData.basic, 'Income Tax', salaryData.tax],
        ['HRA', salaryData.hra, 'Provident Fund', salaryData.pf],
        ['Allowances', salaryData.allowances, 'Loans', salaryData.loans],
        ['', '', 'Total Deductions', salaryData.total_deductions]
      ],
      theme: 'grid'
    });

    // Net Pay
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(`Net Pay: ₹${salaryData.net_pay}`, 15, doc.lastAutoTable.finalY + 20);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('This is a computer generated document and does not require signature', 15, doc.internal.pageSize.height - 10);

    doc.save(`salary-slip-${employee.id}-${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Salary Details</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-gray-600">Net Pay</div>
        <div className="text-gray-900 font-medium">₹{salaryData.net_pay}</div>
        <div className="text-gray-600">Payment Date</div>
        <div className="text-gray-900">{salaryData.payment_date}</div>
      </div>
      <button 
        onClick={generatePDF}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Salary Slip
      </button>
    </div>
  );
}
