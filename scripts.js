const { jsPDF } = window.jspdf;

function calculate() {
    const denominations = [0.05, 0.10, 0.25, 1.00, 2.00, 5.00, 10.00, 20.00, 50.00, 100.00];
    let totalAmount = 0;

    denominations.forEach(denomination => {
        const units = document.getElementById(`units-${denomination.toFixed(2)}`).value;
        const amount = units * denomination;
        document.getElementById(`amount-${denomination.toFixed(2)}`).textContent = `$${amount.toFixed(2)}`;
        totalAmount += amount;
    });

    const coinRollsAmount = parseFloat(document.getElementById('coin-rolls-input').value) || 0;
    totalAmount += coinRollsAmount;

    document.getElementById('total-amount').textContent = `$${totalAmount.toFixed(2)}`;

    const removedAmount = parseFloat(document.getElementById('removed-amount').value) || 0;
    const endingFloat = totalAmount - removedAmount;
    document.getElementById('ending-float').textContent = `$${endingFloat.toFixed(2)}`;

    document.getElementById('register-amount').textContent = `$${totalAmount.toFixed(2)}`;
}

function generatePDF() {
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;

    if (name === '' || date === '') {
        alert('Please, fill all the required fields.');
        return;
    }

    const doc = new jsPDF();

    // Add header
    doc.setFontSize(12);
    doc.text('NYX E-cigs Inc. - 450 Bathurst Street', 10, 10);

    // Add name and date
    doc.text(`Name: ${name}`, 10, 20);
    doc.text(`Date: ${date}`, 10, 30);

    // Capture table data
    const tableData = [];
    const rows = document.querySelectorAll('#dataTable tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [];
        cells.forEach(cell => rowData.push(cell.textContent.trim()));
        tableData.push(rowData);
    });

    // Add total calculated, removed amount, and ending float
    const totalAmount = parseFloat(document.getElementById('total-amount').textContent.replace('$', ''));
    const removedAmount = parseFloat(document.getElementById('removed-amount').value) || 0;
    const coinRollsAmount = parseFloat(document.getElementById('coin-rolls-input').value) || 0;
    const endingFloat = totalAmount - removedAmount;

    if (coinRollsAmount !== 0) {
        tableData.push(['Coin Rolls', `$${coinRollsAmount.toFixed(2)}`]);
    }

    // Add table to PDF
    doc.autoTable({
        head: [['Denomination', 'Amount']],
        body: tableData,
        startY: 40
    });

    // Add total calculated, removed amount, and ending float
    doc.text(`Total: $${totalAmount.toFixed(2)}`, 10, doc.previousAutoTable.finalY + 10);
    doc.text(`Removed: $${removedAmount.toFixed(2)}`, 10, doc.previousAutoTable.finalY + 15);
    doc.text(`Ending Float: $${endingFloat.toFixed(2)}`, 10, doc.previousAutoTable.finalY + 20);

    // Get current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `NYXBathurst_${currentDate}.pdf`;

    // Save PDF with filename
    doc.save(filename);
}
