import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  DeleteOutline as DeleteIcon,
  GetApp as DownloadIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from "@/layouts/invoice/invoiceAPI"; // Import your API function to create an invoice
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Sample invoice data
const sampleInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    customer: "Acme Corp",
    date: "2025-04-15",
    due_date: "2025-05-15",
    company_name: "Mahesh Enterprises",
    gst_number: "29ABCDE1234F1Z5",
    phone_number: "9876543210",
    address: "123 Street, City",
    company_website: "http://www.maheshenterprises.com",
    job_title: "Owner",
    work_email: "owner@maheshenterprises.com",
    gst_percentage: 18.0,
    amount: 2500.00,
    status: "paid",
    items: [
      { description: "Web Development", quantity: 1, unit_price: 2000, amount: 2000 },
      { description: "Hosting (Annual)", quantity: 1, unit_price: 500, amount: 500 }
    ]
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    customer: "XYZ Industries",
    date: "2025-04-10",
    due_date: "2025-05-10",
    company_name: "Mahesh Enterprises",
    gst_number: "29ABCDE1234F1Z5",
    phone_number: "9876543210",
    address: "123 Street, City",
    company_website: "http://www.maheshenterprises.com",
    job_title: "Owner",
    work_email: "owner@maheshenterprises.com",
    gst_percentage: 18.0,
    amount: 3750.00,
    status: "pending",
    items: [
      { description: "UI/UX Design", quantity: 2, unit_price: 1500, amount: 3000 },
      { description: "Logo Design", quantity: 1, unit_price: 750, amount: 750 }
    ]
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    customer: "ABC Solutions",
    date: "2025-03-25",
    due_date: "2025-04-25",
    company_name: "Mahesh Enterprises",
    gst_number: "29ABCDE1234F1Z5",
    phone_number: "9876543210",
    address: "123 Street, City",
    company_website: "http://www.maheshenterprises.com",
    job_title: "Owner",
    work_email: "owner@maheshenterprises.com",
    gst_percentage: 18.0,
    amount: 1200.00,
    status: "paid",
    items: [
      { description: "Technical Support", quantity: 4, unit_price: 300, amount: 1200 }
    ]
  },
  {
    id: 4,
    invoiceNumber: "INV-004",
    customer: "Global Tech",
    date: "2025-04-05",
    due_date: "2025-05-05",
    company_name: "Mahesh Enterprises",
    gst_number: "29ABCDE1234F1Z5",
    phone_number: "9876543210",
    address: "123 Street, City",
    company_website: "http://www.maheshenterprises.com",
    job_title: "Owner",
    work_email: "owner@maheshenterprises.com",
    gst_percentage: 18.0,
    amount: 4200.00,
    status: "pending",
    items: [
      { description: "Mobile App Development", quantity: 1, unit_price: 3500, amount: 3500 },
      { description: "Testing Services", quantity: 1, unit_price: 700, amount: 700 }
    ]
  },
];

const InvoiceManagement = () => {
  const userData = localStorage.getItem('userData')
  const userInfo = userData ? JSON.parse(userData) : {};
  const [invoices, setInvoices] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editedInvoice, setEditedInvoice] = useState(null);
  const [newItem, setNewItem] = useState({ description: '', quantity: 1, unit_price: 0, amount: 0 });

  const [newInvoice, setNewInvoice] = useState({
    id: null,
    invoiceNumber: '',
    company_name: userInfo['company_name'],
    gst_number: userInfo['gst_number'],
    gst_percentage: userInfo['gst_percentage'],
    job_title: userInfo['job_title'],
    phone_number: userInfo['phone_number'],
    work_email: userInfo['work_email'],
    address: userInfo['address'],
    company_website: userInfo['company_website'],
    customer: '',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    amount: 0,
    status: 'pending',
    items: []
  });
  const [editMode, setEditMode] = useState(false);

  // Calculate summary totals
  const totalAmount = invoices?.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
  const totalPaid = invoices?.filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
  const totalPending = invoices?.filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenViewDialog(true);
  };

  const fetchInvoices = async () => {
    const invoices = await getInvoices()
    let invoiceData = invoices.all_invoices
  
    // To replace key name
    invoiceData = invoiceData.map(obj => {
      const { id, total_amount, created_at, line_items, ...rest } = obj;
      return {
        ...rest,
        amount: total_amount,
        date: new Date(created_at).toISOString().split('T')[0],
        invoiceNumber: `INV-${String(id)}`,
        id: id,
        items: Object.keys(line_items).length === 0 ? [] : [line_items]
      };
    });
    console.log("Fetched Invoices: ", invoiceData);
    setInvoices(invoiceData);
  }

  const handleEditInvoice = (edit, invoice={}) => {
    setEditMode(edit)
    if (edit) {
      setSelectedInvoice({...invoice});
      setEditedInvoice({...invoice});
      setOpenEditDialog(true);
    } else {
      setSelectedInvoice({...newInvoice});
      setEditedInvoice({...newInvoice});
      setOpenEditDialog(true);
    }
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedInvoice(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditedInvoice(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    // Reset the new invoice form
    setNewInvoice({
      id: null,
      invoiceNumber: '',
      customer: '',
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      amount: 0,
      status: 'pending',
      items: []
    });
    setNewItem({ description: '', quantity: 1, unit_price: 0, amount: 0 });
  };

  const handleUpdateInvoice = () => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === editedInvoice.id ? editedInvoice : invoice
    );

    const updatedInvoice = {
      ...editedInvoice,
      line_items: [...editedInvoice.items]
    };

    const exemptedAttributes = ["date", "items"];
    const payload = Object.fromEntries(
      Object.entries(updatedInvoice)?.filter(([key]) => !exemptedAttributes.includes(key))
    );
    updateInvoice(editedInvoice.id, {"invoice": payload})

    setInvoices(updatedInvoices);
    setOpenEditDialog(false);
  };

  const handleAddNewInvoice = () => {
    // Generate new ID and Invoice Number
    const nextId = Math.max(...invoices.map(inv => inv.id), 0) + 1;
    const paddedNumber = String(nextId).padStart(3, '0');
    const invoiceNumber = `INV-${paddedNumber}`;
    
    const invoiceToAdd = {
      ...editedInvoice,
      id: nextId,
      invoiceNumber,
      line_items: [...editedInvoice.items]
    };
    
    const exemptedAttributes = ["id", "invoiceNumber", "date", "items"];
    const payload = Object.fromEntries(
      Object.entries(invoiceToAdd)?.filter(([key]) => !exemptedAttributes.includes(key))
    );
    createInvoice({"invoice": payload})
    
    setInvoices([...invoices, invoiceToAdd]);
    setOpenEditDialog(false);
    
    // Reset the new invoice form
    setNewInvoice({
      id: null,
      invoiceNumber: '',
      customer: '',
      date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      amount: 0,
      status: 'pending',
      items: []
    });
  };

  const handleDeleteInvoice = (id) => {
    const updatedInvoices = invoices?.filter(invoice => invoice.id !== id);
    console.log("Updated Invoices: ", updatedInvoices, id);
    deleteInvoice(id)
    setInvoices(updatedInvoices);
  };

  const handleDownloadInvoice = (invoice) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20; // Start vertical position

    // Header: Company Info
    doc.setFontSize(18);
    doc.text(invoice.company_name, 20, y);
    doc.setFontSize(11);
    y += 8;
    doc.text(`Website: ${invoice.company_website}`, 20, y);
    y += 6;
    doc.text(`GST Number: ${invoice.gst_number}`, 20, y);
    y += 6;
    doc.text(`Phone: ${invoice.phone_number}`, 20, y);
    y += 6;
    doc.text(`Email: ${invoice.work_email}`, 20, y);

    // Invoice Details
    y += 12;
    doc.setFontSize(14);
    doc.text("Invoice", 20, y);

    doc.setFontSize(11);
    y += 8;
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, y);
    y += 6;
    doc.text(`Date: ${invoice.date}`, 20, y);
    y += 6;
    doc.text(`Due Date: ${invoice.due_date}`, 20, y);
    y += 6;
    doc.text(`Status: ${invoice.status}`, 20, y);

    // Customer Info
    y += 12;
    doc.setFontSize(14);
    doc.text("Bill To:", 20, y);
    
    doc.setFontSize(11);
    y += 8;
    doc.text(`Customer: ${invoice.customer}`, 20, y);
    y += 6;
    doc.text(`Address: ${invoice.address}`, 20, y);

    // Items Table
    y += 12;

    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows = [];

    invoice.items.forEach((item) => {
      const itemTotal = item.unit_price * item.quantity;
      const rowData = [
        item.description,
        item.quantity.toString(),
        `INR ${item.unit_price}`,
        `INR ${itemTotal}`,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      margin: { left: 20 },
      startY: y,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
    });

    // After the table, calculate Y position for totals
    const finalY = doc.lastAutoTable.finalY + 10;

    const gstAmount = (invoice.amount * invoice.gst_percentage) / 100;
    const totalAmount = Number(invoice.amount) + Number(gstAmount);

    doc.setFontSize(12);
    doc.text(`Subtotal: INR ${invoice.amount}`, 20, finalY);
    doc.text(`GST (${invoice.gst_percentage}%): INR ${gstAmount}`, 20, finalY + 7);
    doc.text(`Total: INR ${totalAmount}`, 20, finalY + 14);

    // Save PDF
    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleChangeEditedInvoice = (e) => {
    setEditedInvoice({
      ...editedInvoice,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeNewInvoice = (e) => {
    setNewInvoice({
      ...newInvoice,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeItemField = (index, field, value) => {
    const updatedItems = [...editedInvoice.items];
    updatedItems[index][field] = value;
    
    // Recalculate amount if quantity or rate changes
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    // Update invoice with new items and recalculate total amount
    const totalAmount = updatedItems?.reduce((sum, item) => sum + item.amount, 0);
    
    setEditedInvoice({
      ...editedInvoice,
      items: updatedItems,
      amount: totalAmount
    });
  };

  const handleChangeNewInvoiceItemField = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index][field] = value;
    
    // Recalculate amount if quantity or rate changes
    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unit_price;
    }
    
    // Update invoice with new items and recalculate total amount
    const totalAmount = updatedItems?.reduce((sum, item) => sum + item.amount, 0);
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: totalAmount
    });
  };
  
  const handleAddItem = () => {
    const calculatedAmount = newItem.quantity * newItem.unit_price;
    const updatedItems = [...editedInvoice.items, {...newItem, amount: calculatedAmount}];
    const newTotalAmount = updatedItems?.reduce((sum, item) => sum + item.amount, 0);
    
    setEditedInvoice({
      ...editedInvoice,
      items: updatedItems,
      amount: newTotalAmount
    });
    
    setNewItem({ description: '', quantity: 1, unit_price: 0, amount: 0 });
  };

  const handleAddNewInvoiceItem = () => {
    const calculatedAmount = newItem.quantity * newItem.unit_price;
    const updatedItems = [...newInvoice.items, {...newItem, amount: calculatedAmount}];
    const newTotalAmount = updatedItems?.reduce((sum, item) => sum + item.amount, 0);
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: newTotalAmount
    });
    
    setNewItem({ description: '', quantity: 1, unit_price: 0, amount: 0 });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = editedInvoice.items?.filter((_, i) => i !== index);
    const newTotalAmount = updatedItems?.reduce((sum, item) => sum + item.amount, 0);
    
    setEditedInvoice({
      ...editedInvoice,
      items: updatedItems,
      amount: newTotalAmount
    });
  };

  const handleRemoveNewInvoiceItem = (index) => {
    const updatedItems = newInvoice.items?.filter((_, i) => i !== index);
    const newTotalAmount = updatedItems?.reduce((sum, item) => sum + item.amount, 0);
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems,
      amount: newTotalAmount
    });
  };

  const handleChangeNewItem = (field, value) => {
    const updatedNewItem = { ...newItem, [field]: value };
    
    // Auto-calculate amount when quantity or rate changes
    if (field === 'quantity' || field === 'unit_price') {
      updatedNewItem.amount = updatedNewItem.quantity * updatedNewItem.unit_price;
    }
    
    setNewItem(updatedNewItem);
  };

  useEffect(() => {
    fetchInvoices();
  },[]);

  const headerCellStyle = {
    width: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  const dataCellStyle = {
    width: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
  }

  console.log("Invoices: ", invoices, selectedInvoice, editedInvoice);
  return (
    <Box>
      <DashboardLayout>
        <DashboardNavbar />
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant='h6' gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h5" component="div">
                  ₹{totalAmount.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant='h6' gutterBottom>
                  Paid
                </Typography>
                <Typography variant="h5" component="div" sx={{ color: 'success.main' }}>
                  ₹{totalPaid.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" variant='h6' gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h5" component="div" sx={{ color: 'warning.main' }}>
                  ₹{totalPending.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2} mr={2}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            style={{ color: '#fff' }}
            onClick={() => handleEditInvoice(false)}
          >
            Add Invoice
          </Button>
        </Box>
        
        <Paper sx={{ p: 2, mb: 4 }}>
          <TableContainer>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={headerCellStyle}>Invoice ID</TableCell>
                  <TableCell sx={headerCellStyle}>Customer</TableCell>
                  <TableCell sx={headerCellStyle}>Date</TableCell>
                  <TableCell sx={headerCellStyle}>Due Date</TableCell>
                  <TableCell align="right" sx={headerCellStyle}>Amount</TableCell>
                  <TableCell sx={headerCellStyle}>Status</TableCell>
                  <TableCell align="center" sx={headerCellStyle}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No Invoice available
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell sx={dataCellStyle}>{invoice.invoiceNumber}</TableCell>
                        <TableCell sx={dataCellStyle}>{invoice.customer}</TableCell>
                        <TableCell sx={dataCellStyle}>{invoice.date}</TableCell>
                        <TableCell sx={dataCellStyle}>{invoice.due_date}</TableCell>
                        <TableCell align="right" sx={dataCellStyle}>₹{Number(invoice.amount).toFixed(2)}</TableCell>
                        <TableCell sx={dataCellStyle}>
                          <Chip 
                            label={invoice.status.toUpperCase()} 
                            color={invoice.status === 'paid' ? 'success' : 'warning'} 
                            size="small"
                            sx={invoice.status === 'paid' ? {
                              backgroundColor: 'rgba(76, 175, 80, 0.2)',
                              color: '#4CAF50',
                              fontWeight: 400,
                              ml: 1
                            } : { 
                              backgroundColor: 'rgba(251, 140, 0, 0.2)',
                              color: '#fb8c00',
                              fontWeight: 400,
                              ml: 1
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={dataCellStyle}>
                          <IconButton size="small" onClick={() => handleViewInvoice(invoice)}>
                            <ViewIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleEditInvoice(true, invoice)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDownloadInvoice(invoice)}>
                            <DownloadIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteInvoice(invoice.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* View Invoice Dialog */}
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
          {selectedInvoice && (
            <>
              <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Invoice {selectedInvoice.invoiceNumber}</Typography>
                  <IconButton onClick={handleCloseViewDialog} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="button">Company:</Typography>
                    <Typography variant="h6">{selectedInvoice.company_name}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="button">GST Number:</Typography>
                    <Typography variant="h6">{selectedInvoice.gst_number}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="button">Phone:</Typography>
                    <Typography variant="h6">{selectedInvoice.phone_number}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="button">Address:</Typography>
                    <Typography variant="h6">{selectedInvoice.address}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="button">Website:</Typography>
                    <Typography variant="h6">{selectedInvoice.company_website}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="button">Contact:</Typography>
                    <Typography variant="h6">{selectedInvoice.job_title} ({selectedInvoice.work_email})</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="button">Customer:</Typography>
                    <Typography variant="h6">{selectedInvoice.customer}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="button">Date:</Typography>
                    <Typography variant="h6">{selectedInvoice.date}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="button">Due Date:</Typography>
                    <Typography variant="h6">{selectedInvoice.due_date}</Typography>
                  </Grid>
                </Grid>
                
                <Box mt={3}>
                  <Typography variant="subtitle2">Items:</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Rate</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInvoice.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">₹{item.unit_price.toFixed(2)}</TableCell>
                            <TableCell align="right">₹{item.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2} />
                          <TableCell align="right">Subtotal:</TableCell>
                          <TableCell align="right">
                            ₹{selectedInvoice.items?.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2} />
                          <TableCell align="right">GST ({selectedInvoice.gst_percentage}%):</TableCell>
                          <TableCell align="right">
                            ₹{(selectedInvoice.items?.reduce((sum, item) => sum + item.amount, 0) * selectedInvoice.gst_percentage / 100).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2} />
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            ₹{(selectedInvoice.items?.reduce((sum, item) => sum + item.amount, 0) + (selectedInvoice.items?.reduce((sum, item) => sum + item.amount, 0) * selectedInvoice.gst_percentage / 100)).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">
                    Status: 
                    <Chip 
                      label={selectedInvoice.status} 
                      color={selectedInvoice.status === 'paid' ? 'success' : 'warning'} 
                      size="small"
                      sx={selectedInvoice.status === 'paid' ? {
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        color: '#4CAF50',
                        fontWeight: 400,
                        ml: 1
                      } : { 
                        backgroundColor: 'rgba(251, 140, 0, 0.2)',
                        color: '#fb8c00',
                        fontWeight: 400,
                        ml: 1
                      }}
                    />
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => {
                    handleCloseViewDialog();
                    handleEditInvoice(true, selectedInvoice);
                  }}
                  color="primary"
                >
                  Edit
                </Button>
                <Button 
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  color="primary"
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
                <Button onClick={handleCloseViewDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Add/Edit Invoice Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="lg" fullWidth>
          {editedInvoice && (
            <>
              <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{editMode ? 'Edit' : 'Add'} Invoice {editedInvoice.invoiceNumber}</Typography>
                  <IconButton onClick={handleCloseEditDialog} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Company Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Company Name"
                      fullWidth
                      name="company_name"
                      value={editedInvoice.company_name}
                      onChange={handleChangeEditedInvoice}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="GST Number"
                      fullWidth
                      name="gst_number"
                      value={editedInvoice.gst_number}
                      onChange={handleChangeEditedInvoice}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      name="phone_number"
                      value={editedInvoice.phone_number}
                      onChange={handleChangeEditedInvoice}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Address"
                      fullWidth
                      name="address"
                      value={editedInvoice.address}
                      onChange={handleChangeEditedInvoice}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Company Website"
                      fullWidth
                      name="company_website"
                      value={editedInvoice.company_website}
                      onChange={handleChangeEditedInvoice}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Job Title"
                      fullWidth
                      name="job_title"
                      value={editedInvoice.job_title}
                      onChange={handleChangeEditedInvoice}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Work Email"
                      fullWidth
                      name="work_email"
                      value={editedInvoice.work_email}
                      onChange={handleChangeEditedInvoice}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="GST Percentage"
                      type="number"
                      fullWidth
                      name="gst_percentage"
                      value={editedInvoice.gst_percentage}
                      onChange={handleChangeEditedInvoice}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Customer Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Customer"
                      fullWidth
                      name="customer"
                      value={editedInvoice.customer}
                      onChange={handleChangeEditedInvoice}
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={3}>
                    <TextField
                      label="Date"
                      type="date"
                      fullWidth
                      name="date"
                      value={editedInvoice.date}
                      onChange={handleChangeEditedInvoice}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid> */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Due Date"
                      type="date"
                      fullWidth
                      name="due_date"
                      value={editedInvoice.due_date}
                      onChange={handleChangeEditedInvoice}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={editedInvoice.status}
                        label="Status"
                        onChange={handleChangeEditedInvoice}
                        sx={{ padding: '0.75rem 0' }}
                      >
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box mt={3}>
                  <Typography variant="h6">Items</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Rate</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {editedInvoice.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                size="small"
                                value={item.description}
                                onChange={(e) => handleChangeItemField(index, 'description', e.target.value)}
                                fullWidth
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                size="small"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleChangeItemField(index, 'quantity', Number(e.target.value))}
                                sx={{ width: 80 }}
                                inputProps={{ min: 1 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <TextField
                                size="small"
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => handleChangeItemField(index, 'unit_price', Number(e.target.value))}
                                sx={{ width: 100 }}
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              ₹{item.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <IconButton size="small" onClick={() => handleRemoveItem(index)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {/* Add new item row */}
                        <TableRow>
                          <TableCell>
                            <TextField
                              size="small"
                              placeholder="Description"
                              value={newItem.description}
                              onChange={(e) => handleChangeNewItem('description', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              size="small"
                              type="number"
                              placeholder="Qty"
                              value={newItem.quantity}
                              onChange={(e) => handleChangeNewItem('quantity', Number(e.target.value))}
                              sx={{ width: 80 }}
                              inputProps={{ min: 1 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              size="small"
                              type="number"
                              placeholder="Rate"
                              value={newItem.unit_price}
                              onChange={(e) => handleChangeNewItem('unit_price', Number(e.target.value))}
                              sx={{ width: 100 }}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            ₹{newItem.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={handleAddItem}
                              disabled={!newItem.description || newItem.quantity < 1 || newItem.rate <= 0}
                            >
                              <AddIcon fontSize="small" sx={{ color: '#fff' }}/>
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            ₹{Number(editedInvoice?.amount).toFixed(2)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditDialog}>Cancel</Button>
                <Button onClick={editMode ? handleUpdateInvoice: handleAddNewInvoice} color="primary" variant="contained" style={{ color: '#fff' }}>
                  {editMode ? 'Update' : 'Submit'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </DashboardLayout>
    </Box>
  );
};

export default InvoiceManagement;
