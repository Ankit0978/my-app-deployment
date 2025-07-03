import React, { useState, useEffect } from 'react';
import { Heart, Search, Plus, Grid3X3, Bookmark, Sparkles, TrendingUp, Shield, Award, Edit, Trash2, Save, X, ArrowLeft, Mail, Phone, DollarSign, Calendar, CheckCircle, Target, CreditCard, QrCode, ChevronDown } from 'lucide-react';

const MoneyHoldingsApp = () => {
  // Initialize state from localStorage on component mount
  const [companyData, setCompanyData] = useState(() => {
    try {
      const storedCompanies = localStorage.getItem('moneyHoldingsCompanies');
      return storedCompanies ? JSON.parse(storedCompanies) : [];
    } catch (error) {
      console.error('Error parsing company data from localStorage:', error);
      return [];
    }
  });

  const [savedNames, setSavedNames] = useState(() => {
    try {
      const storedSavedNames = localStorage.getItem('moneyHoldingsSavedNames');
      return storedSavedNames ? JSON.parse(storedSavedNames) : [];
    } catch (error) {
      console.error('Error parsing saved names from localStorage:', error);
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [animateCards, setAnimateCards] = useState(false); // Used for initial card animation
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'create', 'edit', 'charges', 'services', 'payment'
  const [editingItem, setEditingItem] = useState(null); // Stores the company being edited
  const [selectedPlan, setSelectedPlan] = useState(null); // Stores selected plan key from consultancy charges
  const [selectedCompany, setSelectedCompany] = useState(null); // Stores company object for individual company payments

  // State for new/edited company form
  const [newName, setNewName] = useState({
    name: '',
    services: [],
    color: '#90CAF9', // Default soothing blue background for new companies
    textColor: '#333333', // Default dark text color
    consultancyPlan: '2months'
  });

  // Consultancy plans data
  const consultancyPlans = {
    '2months': { duration: '2 Months', price: 3000 },
    '4months': { duration: '4 Months', price: 5000 },
    '6months': { duration: '6 Months', price: 7000 },
    '8months': { duration: '8 Months', price: 10000 },
    '1year': { duration: '1 Year', price: 12000 }
  };

  // Core services offered for selection dropdowns
  const coreServices = [
    'Stock Market Advisory',
    'Mutual Fund Planning',
    'Wealth Management',
    'Tax Planning (India + basic international)',
    'Retirement Planning',
    'NRI Investment Services',
    'Financial Education (courses, webinars, workshops)',
    'Cryptocurrency Awareness & Guidance (for beginners)',
    'Real Estate Planning',
    'Insurance Advisory (Life, Health, General)'
  ];

  // Effect to save companyData to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('moneyHoldingsCompanies', JSON.stringify(companyData));
    } catch (error) {
      console.error('Error saving company data to localStorage:', error);
    }
  }, [companyData]);

  // Effect to save savedNames to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('moneyHoldingsSavedNames', JSON.stringify(savedNames));
    } catch (error) {
      console.error('Error saving saved names to localStorage:', error);
    }
  }, [savedNames]);

  // Trigger card animation on initial load
  useEffect(() => {
    setAnimateCards(true);
  }, []);

  // Function to toggle a company's saved status
  const toggleSaved = (id) => {
    const newSavedNames = savedNames.includes(id)
      ? savedNames.filter(savedId => savedId !== id)
      : [...savedNames, id];
    setSavedNames(newSavedNames);
  };

  // Function to delete a company
  const deleteCompany = (id) => {
    const newCompanyData = companyData.filter(company => company.id !== id);
    const newSavedNames = savedNames.filter(savedId => savedId !== id); // Also remove from saved list
    setCompanyData(newCompanyData);
    setSavedNames(newSavedNames);
  };

  // Function to start editing a company
  const startEdit = (company) => {
    setEditingItem({ ...company }); // Copy company data to editingItem
    // Populate newName state with current editing item details
    setNewName({
      name: company.name,
      services: company.services,
      color: company.color,
      textColor: company.textColor,
      consultancyPlan: company.consultancyPlan
    });
    setCurrentPage('edit');
  };

  // Function to save edited company details
  const saveEdit = () => {
    if (editingItem && newName.name.trim()) {
      const updatedCompanyData = companyData.map(company =>
        company.id === editingItem.id ? {
          ...newName,
          id: editingItem.id, // Keep the original ID
          // Ensure gradient is dynamically set if color changes
          gradient: `linear-gradient(135deg, ${newName.color} 0%, ${newName.color}dd 100%)`
        } : company
      );
      setCompanyData(updatedCompanyData);
      setEditingItem(null); // Clear editing item
      // Reset newName state
      setNewName({
        name: '',
        services: [],
        color: '#90CAF9',
        textColor: '#333333',
        consultancyPlan: '2months'
      });
      setCurrentPage('main');
    } else {
      // Basic validation for name
      alert('Company name cannot be empty.');
    }
  };

  // Function to add a new company
  const addNewCompany = () => {
    if (newName.name.trim() && newName.services.length > 0) {
      const newCompany = {
        ...newName,
        id: Date.now(), // Unique ID for new company
        services: newName.services.filter(s => s.trim()), // Clean up services
        // Generate gradient based on selected color
        gradient: `linear-gradient(135deg, ${newName.color} 0%, ${newName.color}dd 100%)`
      };

      setCompanyData([...companyData, newCompany]); // Add new company to data
      // Reset newName state for next entry
      setNewName({
        name: '',
        services: [],
        color: '#90CAF9',
        textColor: '#333333',
        consultancyPlan: '2months'
      });
      setCurrentPage('main'); // Go back to main view
    } else {
      alert('Please fill in the company name and select at least one service.');
    }
  };

  // Handle payment initiation (for overall plans or specific companies)
  const handlePayment = (plan, company = null) => {
    setSelectedPlan(plan);
    setSelectedCompany(company);
    setCurrentPage('payment');
  };

  // Handle payment for a specific company's plan
  const handleCompanyPayment = (company) => {
    const plan = consultancyPlans[company.consultancyPlan];
    handlePayment(plan, company);
  };

  // UPI link generation (for demonstration)
  const generateUPILink = (amount, description = 'Money Holdings Consultancy') => {
    const upiId = 'ankitjha08400-2@okhdfcbank'; // Placeholder UPI ID
    const upiUrl = `upi://pay?pa=${upiId}&pn=Money Holdings&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
    return upiUrl;
  };

  // Handle UPI payment action
  const handleUPIPayment = () => {
    if (selectedPlan) {
      const description = selectedCompany
        ? `${selectedCompany.name} - ${selectedPlan.duration} Plan`
        : `${selectedPlan.duration} Consultancy Plan`;
      const upiLink = generateUPILink(selectedPlan.price, description);

      window.location.href = upiLink; // Attempt to open UPI app

      // Fallback message if app doesn't open
      setTimeout(() => {
        // In a real app, use a custom modal instead of alert
        alert('If UPI app didn\'t open, please use the QR code to complete payment.');
      }, 2000);
    }
  };

  // Update field in newName state (for create/edit forms)
  const updateNewNameField = (field, value) => {
    setNewName(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle service selection in newName state
  const toggleServiceInNewName = (service) => {
    setNewName(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  // Update field in editingItem state (for edit form)
  const updateEditingField = (field, value) => {
    setEditingItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle service selection in editingItem state
  const toggleServiceInEditing = (service) => {
    setEditingItem(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  // Filter companies based on search term
  const filteredCompanies = companyData.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Company Card Component
  const CompanyCard = ({ company, index }) => (
    <div
      className="company-card"
      style={{
        background: company.gradient, // Use dynamic gradient
        animationDelay: `${index * 0.1}s` // Staggered animation
      }}
    >
      <div className="card-content">
        <h3 style={{ color: company.textColor }} className="company-name">
          {company.name}
        </h3>
        <div className="services-list">
          {company.services.map((service, idx) => (
            <span key={idx} className="service-tag">
              {service}
            </span>
          ))}
        </div>
        <div className="consultancy-info">
          <div className="consultancy-badge">
            <Calendar size={12} />
            <span>{consultancyPlans[company.consultancyPlan]?.duration}</span>
          </div>
          <div className="price-badge">
            <DollarSign size={12} />
            <span>₹{consultancyPlans[company.consultancyPlan]?.price}</span>
          </div>
        </div>

        <div className="company-pay-section">
          <button
            onClick={() => handleCompanyPayment(company)}
            className="company-pay-btn"
          >
            <CreditCard size={16} />
            Pay Now - ₹{consultancyPlans[company.consultancyPlan]?.price}
          </button>
        </div>
      </div>

      <div className="card-actions">
        <button
          onClick={() => toggleSaved(company.id)}
          className={`heart-btn ${savedNames.includes(company.id) ? 'saved' : ''}`}
        >
          <Heart size={18} />
        </button>
        <button
          onClick={() => startEdit(company)}
          className="edit-btn"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => deleteCompany(company.id)}
          className="delete-btn"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  // Services Offered Promotional Card
  const ServicesOfferedCard = () => (
    <div
      className="company-card services-offered-card"
      style={{
        background: 'linear-gradient(135deg, #A5D6A7 0%, #66BB6A 100%)', // Soothing green
        cursor: 'pointer'
      }}
      onClick={() => setCurrentPage('services')}
    >
      <div className="card-content">
        <h3 style={{ color: '#333333' }} className="company-name">
          ✅ OUR Vision and Services
        </h3>
        <div className="services-list">
          <span className="service-tag" style={{ background: 'rgba(0,0,0,0.1)', color: '#333333' }}>
            Core Services to Offer
          </span>
        </div>
        <div className="consultancy-info">
          <div className="consultancy-badge" style={{ background: 'rgba(0,0,0,0.05)', color: '#333333' }}>
            <Target size={12} />
            <span>10 Core Services</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Consultancy Charges Promotional Card
  const ConsultancyChargesCard = () => (
    <div
      className="company-card consultancy-charges-card"
      style={{
        background: 'linear-gradient(135deg, #B39DDB 0%, #7E57C2 100%)', // Soothing purple
        cursor: 'pointer'
      }}
      onClick={() => setCurrentPage('charges')}
    >
      <div className="card-content">
        <h3 style={{ color: '#333333' }} className="company-name">
          Consultancy Charges
        </h3>
        <div className="services-list">
          <span className="service-tag" style={{ background: 'rgba(0,0,0,0.1)', color: '#333333' }}>
            View Pricing Plans
          </span>
        </div>
        <div className="consultancy-info">
          <div className="consultancy-badge" style={{ background: 'rgba(0,0,0,0.05)', color: '#333333' }}>
            <DollarSign size={12} />
            <span>Starting ₹3,000</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Payment Page Component
  const PaymentPage = () => (
    <div className="payment-page page-container">
      <div className="page-header">
        <button onClick={() => setCurrentPage(selectedCompany ? 'main' : 'charges')} className="back-btn">
          <ArrowLeft size={20} />
          {selectedCompany ? 'Back to Browse' : 'Back to Charges'}
        </button>
        <h2 className="page-title">Complete Payment</h2>
      </div>

      <div className="payment-container form-container"> {/* Reusing form-container styles */}
        {selectedPlan && (
          <div className="payment-card">
            <div className="payment-header">
              {selectedCompany && (
                <div className="payment-company-info">
                  <h4>Company: {selectedCompany.name}</h4>
                </div>
              )}
              <h3>Selected Plan: {selectedPlan.duration}</h3>
              <div className="payment-amount">
                <DollarSign size={24} />
                <span>₹{selectedPlan.price}</span>
              </div>
            </div>

            <div className="payment-methods">
              <h4>Choose Payment Method:</h4>

              <div className="payment-method-card">
                <div className="payment-method-header">
                  <QrCode size={24} />
                  <h5>UPI Payment</h5>
                </div>
                <p>Pay using any UPI app (PhonePe, Google Pay, Paytm, etc.)</p>
                <button onClick={handleUPIPayment} className="payment-btn">
                  <CreditCard size={16} />
                  Pay with UPI
                </button>
              </div>

              <div className="qr-code-section">
                <h5>Or Scan QR Code:</h5>
                <div className="qr-placeholder">
                  <QrCode size={100} />
                  <p>UPI ID: ankitjha08400-2@okhdfcbank</p>
                  <p className="qr-note">Scan this QR code with any UPI app to pay ₹{selectedPlan.price}</p>
                </div>
              </div>

              <div className="payment-info">
                <h5>After Payment:</h5>
                <ul>
                  <li>Take a screenshot of the payment confirmation</li>
                  <li>Send it to our WhatsApp: +91 8103170084</li>
                  <li>We'll activate your consultancy plan within 24 hours</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Services Offered Page Content
  const ServicesOfferedPage = () => (
    <div className="services-page page-container">
      <div className="page-header">
        <button onClick={() => setCurrentPage('main')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Browse
        </button>
        <h2 className="page-title">✅ OUR Vision and Services</h2>
      </div>

      <div className="services-container form-container"> {/* Reusing form-container styles */}
        <div className="services-intro">
          <h3 className="services-subtitle">Core Services to Offer:</h3>
        </div>

        <div className="services-grid">
          {coreServices.map((service, index) => (
            <div key={index} className="service-item">
              <div className="service-number">{index + 1}.</div>
              <div className="service-content">
                <CheckCircle size={20} className="service-icon" />
                <span className="service-text">{service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Consultancy Charges Page Content
  const ConsultancyChargesPage = () => (
    <div className="charges-page page-container">
      <div className="page-header">
        <button onClick={() => setCurrentPage('main')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Browse
        </button>
        <h2 className="page-title">Consultancy Charges</h2>
      </div>

      <div className="charges-container form-container"> {/* Reusing form-container styles */}
        <div className="charges-grid">
          {Object.entries(consultancyPlans).map(([key, plan]) => (
            <div key={key} className="charge-card">
              <div className="charge-header">
                <Calendar size={24} />
                <h3>{plan.duration}</h3>
              </div>
              <div className="charge-price">
                <DollarSign size={20} />
                <span>₹{plan.price}</span>
              </div>
              <div className="charge-features">
                <p>✓ Complete Financial Analysis</p>
                <p>✓ Investment Strategy</p>
                <p>✓ Regular Portfolio Review</p>
                <p>✓ 24/7 Support</p>
              </div>
              <button
                onClick={() => handlePayment(plan)}
                className="pay-now-btn"
              >
                <CreditCard size={16} />
                Pay Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Create New Company Page Content
  const CreateNewPage = () => {
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

    return (
      <div className="create-new-page page-container">
        <div className="page-header">
          <button onClick={() => setCurrentPage('main')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Browse
          </button>
          <h2 className="page-title">Create New Investment Company</h2>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={newName.name}
              onChange={(e) => updateNewNameField('name', e.target.value)}
              placeholder="Enter company name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Services</label>
            <div className="services-dropdown-container">
              <button
                type="button"
                className="services-dropdown-btn"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                <span>Select Services ({newName.services.length} selected)</span>
                <ChevronDown size={20} className={servicesDropdownOpen ? 'rotated' : ''} />
              </button>

              {servicesDropdownOpen && (
                <div className="services-dropdown-menu">
                  {coreServices.map((service, index) => (
                    <div key={index} className="service-dropdown-item">
                      <input
                        type="checkbox"
                        id={`new-service-${index}`}
                        checked={newName.services.includes(service)}
                        onChange={() => toggleServiceInNewName(service)}
                        className="service-checkbox"
                      />
                      <label htmlFor={`new-service-${index}`} className="service-checkbox-label">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display selected services */}
            <div className="selected-services">
              {newName.services.map((service, idx) => (
                <span key={idx} className="selected-service-tag">
                  {service}
                  <button
                    type="button"
                    onClick={() => toggleServiceInNewName(service)}
                    className="remove-selected-service"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Consultancy Plan</label>
            <select
              value={newName.consultancyPlan}
              onChange={(e) => updateNewNameField('consultancyPlan', e.target.value)}
              className="form-select"
            >
              {Object.entries(consultancyPlans).map(([key, plan]) => (
                <option key={key} value={key}>
                  {plan.duration} - ₹{plan.price}
                </option>
              ))}
            </select>
          </div>

          <div className="color-group">
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={newName.color}
                onChange={(e) => updateNewNameField('color', e.target.value)}
                className="color-input"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={newName.textColor}
                onChange={(e) => updateNewNameField('textColor', e.target.value)}
                className="color-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button onClick={() => setCurrentPage('main')} className="cancel-btn" type="button">
              Cancel
            </button>
            <button onClick={addNewCompany} className="save-btn" type="button">
              <Save size={16} />
              Create Company
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Company Page Content
  const EditPage = () => {
    const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

    // If editingItem is null (e.g., direct navigation to /edit without context), redirect to main
    useEffect(() => {
      if (!editingItem) {
        setCurrentPage('main');
      } else {
        // When opening edit page, ensure newName reflects editingItem for form fields
        setNewName({
          name: editingItem.name,
          services: editingItem.services,
          color: editingItem.color,
          textColor: editingItem.textColor,
          consultancyPlan: editingItem.consultancyPlan
        });
      }
    }, [editingItem]); // Depend on editingItem to re-populate form

    if (!editingItem) return null; // Don't render if no item is being edited

    return (
      <div className="edit-page page-container">
        <div className="page-header">
          <button onClick={() => { setCurrentPage('main'); setEditingItem(null); }} className="back-btn">
            <ArrowLeft size={20} />
            Back to Browse
          </button>
          <h2 className="page-title">Edit {editingItem?.name}</h2>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={newName.name || ''} // Use newName as source for form inputs
              onChange={(e) => updateNewNameField('name', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Services</label>
            <div className="services-dropdown-container">
              <button
                type="button"
                className="services-dropdown-btn"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              >
                <span>Select Services ({newName.services.length || 0} selected)</span>
                <ChevronDown size={20} className={servicesDropdownOpen ? 'rotated' : ''} />
              </button>

              {servicesDropdownOpen && (
                <div className="services-dropdown-menu">
                  {coreServices.map((service, index) => (
                    <div key={index} className="service-dropdown-item">
                      <input
                        type="checkbox"
                        id={`edit-service-${index}`}
                        checked={newName.services.includes(service) || false}
                        onChange={() => toggleServiceInNewName(service)}
                        className="service-checkbox"
                      />
                      <label htmlFor={`edit-service-${index}`} className="service-checkbox-label">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display selected services */}
            <div className="selected-services">
              {newName.services.map((service, idx) => (
                <span key={idx} className="selected-service-tag">
                  {service}
                  <button
                    type="button"
                    onClick={() => toggleServiceInNewName(service)}
                    className="remove-selected-service"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Consultancy Plan</label>
            <select
              value={newName.consultancyPlan || '2months'} // Use newName as source
              onChange={(e) => updateNewNameField('consultancyPlan', e.target.value)}
              className="form-select"
            >
              {Object.entries(consultancyPlans).map(([key, plan]) => (
                <option key={key} value={key}>
                  {plan.duration} - ₹{plan.price}
                </option>
              ))}
            </select>
          </div>

          <div className="color-group">
            <div className="form-group">
              <label>Background Color</label>
              <input
                type="color"
                value={newName.color || '#90CAF9'} // Use newName as source
                onChange={(e) => updateNewNameField('color', e.target.value)}
                className="color-input"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={newName.textColor || '#333333'} // Use newName as source
                onChange={(e) => updateNewNameField('textColor', e.target.value)}
                className="color-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button onClick={() => { setCurrentPage('main'); setEditingItem(null); }} className="cancel-btn" type="button">
              Cancel
            </button>
            <button onClick={saveEdit} className="save-btn" type="button">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main content area, displays cards based on active tab and search
  const MainContent = () => (
    <>
      {activeTab === 'browse' && (
        <>
          <div className="section-header">
            <h2 className="section-title">Browse Investment Companies</h2>
            <p className="section-subtitle">Manage your investment portfolio companies with consultancy plans</p>
          </div>

          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name or service..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="cards-grid">
            <ServicesOfferedCard />
            <ConsultancyChargesCard />
            {/* Render actual company cards */}
            {filteredCompanies.map((company, index) => (
              <CompanyCard key={company.id} company={company} index={index + 2} /> // Adjust index for animation delay
            ))}
          </div>
        </>
      )}

      {activeTab === 'saved' && (
        <div className="saved-section">
          <div className="section-header">
            <h2 className="section-title">Your Saved Companies</h2>
            <p className="section-subtitle">Your curated collection of favorite investment companies</p>
          </div>
          {savedNames.length === 0 ? (
            <div className="empty-state">
              <Shield size={48} />
              <p>No saved companies yet. Browse companies and click the heart icon to save them!</p>
            </div>
          ) : (
            <div className="cards-grid">
              {/* Filter companyData to show only saved companies */}
              {companyData
                .filter(company => savedNames.includes(company.id))
                .map((company, index) => (
                  <CompanyCard key={company.id} company={company} index={index} />
                ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  // Footer Component
  const Footer = () => (
    <footer className="footer">
      <div className="footer-content">
        <p>Contact Us:</p>
        <div className="contact-info">
          <a href="mailto:divya.december1197@gmail.com" className="contact-link">
            <Mail size={16} />
            divya.december1197@gmail.com
          </a>
          <a href="tel:+918103170084" className="contact-link">
            <Phone size={16} />
            +91 8103170084
          </a>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} Money Holdings. All rights reserved.</p>
      </div>
    </footer>
  );

  // Main App Structure
  return (
    <div className="app">
      {/* Global Styles */}
      <style jsx>{`
        /* Universal Box Model Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Body and App Container Styling for Soothing Theme */
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #e0f2f7; /* Very light background for body */
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f2f7 0%, #ccedf2 100%); /* Soothing light blue/green gradient */
          padding: 20px;
          position: relative;
          display: flex;
          flex-direction: column; /* Allows footer to stick to bottom */
        }

        /* Gradient overlay for subtle visual effect */
        .app::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at top, rgba(165, 214, 167, 0.1) 0%, transparent 50%),
                      radial-gradient(ellipse at bottom, rgba(144, 202, 249, 0.1) 0%, transparent 50%);
          pointer-events: none; /* Allows clicks to pass through */
          z-index: 0;
        }

        /* Header Styling */
        .header {
          background: rgba(255, 255, 255, 0.9); /* Lighter, more opaque background */
          backdrop-filter: blur(15px); /* Slightly less blur for softer feel */
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 32px;
          border: 1px solid rgba(255, 255, 255, 0.6); /* Lighter border */
          position: relative;
          z-index: 1; /* Ensure it's above background effects */
          box-shadow: 0 10px 30px rgba(0,0,0,0.08); /* Soft shadow */
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap; /* Allow wrapping on smaller screens */
          gap: 24px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%); /* Soothing green tint */
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
          box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3); /* Matching shadow */
        }

        .app-title {
          color: #333; /* Darker text for readability */
          font-size: 32px;
          font-weight: 800;
          margin: 0;
        }

        .app-subtitle {
          color: #555; /* Darker text for subtitle */
          font-size: 16px;
          margin: 4px 0 0 0;
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .add-btn {
          background: linear-gradient(135deg, #66BB6A 0%, #43A047 100%); /* Soothing green button */
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(102, 187, 106, 0.3);
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 187, 106, 0.4);
        }

        /* Navigation Tabs Styling */
        .nav-tabs {
          background: rgba(255, 255, 255, 0.8); /* Lighter background */
          backdrop-filter: blur(15px);
          border-radius: 16px;
          padding: 8px;
          margin-bottom: 32px;
          display: flex;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          position: relative;
          z-index: 1;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        .nav-tab {
          background: transparent;
          color: #666; /* Darker text */
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          flex: 1;
          justify-content: center;
        }

        .nav-tab.active {
          background: rgba(200, 230, 201, 0.8); /* Soothing light green tint for active */
          color: #333; /* Darker text */
          backdrop-filter: blur(10px);
        }

        .nav-tab:hover:not(.active) {
          background: rgba(255, 255, 255, 0.4);
          color: #333;
        }

        /* Main Content Area */
        .main-content {
          position: relative;
          z-index: 1;
          flex-grow: 1; /* Pushes footer to bottom */
        }

        .section-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .section-title {
          color: #333;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .section-subtitle {
          color: #555;
          font-size: 16px;
        }

        /* Search Bar Styling */
        .search-container {
          position: relative;
          max-width: 600px;
          margin: 0 auto 32px auto;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.7); /* Lighter input background */
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          padding: 16px 16px 16px 48px;
          color: #333; /* Darker text */
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .search-input::placeholder {
          color: #888;
        }

        .search-input:focus {
          border-color: #64B5F6; /* Soothing blue focus */
          box-shadow: 0 0 0 4px rgba(100, 181, 246, 0.2);
        }

        /* Company Card Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .company-card {
          background: rgba(255, 255, 255, 0.9); /* Lighter card background */
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          position: relative;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          animation: slideInUp 0.6s ease forwards;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .company-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .card-content {
          margin-bottom: 16px;
        }

        .company-name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .services-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .service-tag {
          background: rgba(0, 0, 0, 0.1); /* Darker transparent tag */
          color: #333; /* Darker text */
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(5px);
        }

        .consultancy-info {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .consultancy-badge, .price-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.05); /* Lighter background for badges */
          color: #333;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .company-pay-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 0, 0, 0.1); /* Darker border */
        }

        .company-pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #FFB74D 0%, #FF9800 100%); /* Soothing orange */
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(255, 183, 77, 0.3);
        }

        .company-pay-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 183, 77, 0.4);
        }

        .card-actions {
          display: flex;
          gap: 8px;
          position: absolute;
          top: 16px;
          right: 16px;
        }

        .heart-btn, .edit-btn, .delete-btn {
          background: rgba(255, 255, 255, 0.6); /* Lighter action button background */
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .heart-btn {
          color: #888;
        }

        .heart-btn.saved {
          color: #EF5350; /* Red for saved */
          background: rgba(239, 83, 80, 0.1);
        }

        .heart-btn:hover {
          background: rgba(239, 83, 80, 0.1);
          color: #EF5350;
        }

        .edit-btn {
          color: #888;
        }

        .edit-btn:hover {
          background: rgba(100, 181, 246, 0.1);
          color: #64B5F6;
        }

        .delete-btn {
          color: #888;
        }

        .delete-btn:hover {
          background: rgba(239, 83, 80, 0.1);
          color: #EF5350;
        }

        /* Promotional Cards Specific Styling */
        .services-offered-card {
          background: linear-gradient(135deg, #A5D6A7 0%, #66BB6A 100%) !important; /* Soothing green */
          color: #333333;
        }
        .services-offered-card .company-name,
        .services-offered-card .consultancy-badge span {
          color: #333333;
        }
        .services-offered-card .consultancy-badge svg {
          color: #4CAF50;
        }


        .consultancy-charges-card {
          background: linear-gradient(135deg, #B39DDB 0%, #7E57C2 100%) !important; /* Soothing purple */
          color: #333333;
        }
        .consultancy-charges-card .company-name,
        .consultancy-charges-card .consultancy-badge span {
          color: #333333;
        }
        .consultancy-charges-card .consultancy-badge svg {
          color: #7E57C2;
        }


        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-state svg {
          margin-bottom: 16px;
          color: #999;
        }

        /* Page Container and Header for forms/details pages */
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1; /* Ensure content is above background effects */
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          color: #333;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.9);
        }

        .page-title {
          color: #333;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        /* Form Container Styling (used for Create, Edit, Payment, Services, Charges pages) */
        .form-container {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          color: #333;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .form-input, .form-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 12px 16px;
          color: #333; /* Dark text for inputs */
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .form-input::placeholder {
          color: #888;
        }

        .form-input:focus, .form-select:focus {
          border-color: #64B5F6; /* Soothing blue focus */
          box-shadow: 0 0 0 4px rgba(100, 181, 246, 0.1);
        }

        /* Services Dropdown in Forms */
        .services-dropdown-container {
          position: relative;
        }

        .services-dropdown-btn {
          width: 100%;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          padding: 12px 16px;
          color: #333; /* Dark text */
          font-size: 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .services-dropdown-btn:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        .services-dropdown-btn .rotated {
          transform: rotate(180deg);
        }

        .services-dropdown-menu {
          position: absolute;
          top: 100%; /* Position below the button */
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98); /* Very light background for dropdown */
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          margin-top: 4px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1000; /* Ensure it's on top */
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          color: #333; /* Ensure all text within the dropdown menu is dark */
        }

        .service-dropdown-item {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08); /* Lighter separator */
        }

        .service-dropdown-item:last-child {
          border-bottom: none;
        }

        .service-dropdown-item:hover {
          background: rgba(100, 181, 246, 0.1); /* Soothing blue hover */
        }

        .service-checkbox {
          margin: 0; /* Reset default margin */
        }

        .service-checkbox-label {
          color: #333; /* Explicitly dark text for visibility */
          cursor: pointer;
          margin: 0;
          font-weight: 500;
        }

        /* Selected Services Display */
        .selected-services {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .selected-service-tag {
          background: linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%); /* Soothing blue tag */
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .remove-selected-service {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .remove-selected-service:hover {
          color: #FF8A65; /* Soothing orange-red on hover */
        }

        /* Color Pickers Group */
        .color-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .color-input {
          width: 100%;
          height: 48px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          cursor: pointer;
        }

        /* Form Actions (Buttons) */
        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        .cancel-btn {
          background: rgba(255, 255, 255, 0.7);
          color: #666;
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.8);
          color: #333;
        }

        .save-btn {
          background: linear-gradient(135deg, #66BB6A 0%, #43A047 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(102, 187, 106, 0.3);
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 187, 106, 0.4);
        }

        /* Services/Charges/Payment Page General Styles */
        .services-page, .charges-page, .payment-page {
          position: relative;
          z-index: 1;
        }

        .services-container, .charges-container, .payment-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .services-intro {
          text-align: center;
          margin-bottom: 32px;
        }

        .services-subtitle {
          color: #333;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        /* Services Grid on Services Page */
        .services-grid {
          display: grid;
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }

        .service-item {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        .service-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateX(8px);
        }

        .service-number {
          background: linear-gradient(135deg, #66BB6A 0%, #43A047 100%);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .service-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .service-icon {
          color: #66BB6A;
          flex-shrink: 0;
        }

        .service-text {
          color: #333;
          font-weight: 500;
          font-size: 16px;
        }

        /* Charges Grid on Consultancy Charges Page */
        .charges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }

        .charge-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .charge-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .charge-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .charge-header svg {
          color: #A78BFA; /* Soothing purple */
        }

        .charge-header h3 {
          color: #333;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .charge-price {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .charge-price svg {
          color: #66BB6A;
        }

        .charge-price span {
          color: #333;
          font-size: 32px;
          font-weight: 800;
        }

        .charge-features {
          margin-bottom: 32px;
        }

        .charge-features p {
          color: #555;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .pay-now-btn {
          width: 100%;
          background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%); /* Soothing purple */
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(167, 139, 250, 0.3);
        }

        .pay-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(167, 139, 250, 0.4);
        }

        /* Payment Page Specific Styles */
        .payment-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .payment-header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .payment-company-info {
          margin-bottom: 16px;
        }

        .payment-company-info h4 {
          color: #555;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .payment-header h3 {
          color: #333;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .payment-amount {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .payment-amount svg {
          color: #66BB6A;
        }

        .payment-amount span {
          color: #333;
          font-size: 36px;
          font-weight: 800;
        }

        .payment-methods h4 {
          color: #333;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .payment-method-card {
          background: rgba(0, 0, 0, 0.03); /* Very light subtle background */
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .payment-method-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .payment-method-header svg {
          color: #A78BFA;
        }

        .payment-method-header h5 {
          color: #333;
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }

        .payment-method-card p {
          color: #555;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .payment-btn {
          width: 100%;
          background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(167, 139, 250, 0.3);
        }

        .payment-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(167, 139, 250, 0.4);
        }

        .qr-code-section {
          text-align: center;
          margin-bottom: 24px;
        }

        .qr-code-section h5 {
          color: #333;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .qr-placeholder {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .qr-placeholder svg {
          color: #999;
          margin-bottom: 12px;
        }

        .qr-placeholder p {
          color: #555;
          margin: 8px 0;
          font-size: 14px;
        }

        .qr-note {
          font-weight: 600 !important;
          color: #333 !important;
        }

        .payment-info {
          background: rgba(0, 0, 0, 0.03);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .payment-info h5 {
          color: #333;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .payment-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .payment-info li {
          color: #555;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
          font-size: 14px;
        }

        .payment-info li::before {
          content: '•';
          color: #66BB6A;
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        /* Footer Styling */
        .footer {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(15px);
          border-radius: 24px;
          padding: 24px;
          margin-top: 32px; /* Add margin to separate from main content */
          border: 1px solid rgba(255, 255, 255, 0.6);
          text-align: center;
          color: #666; /* Darker text for footer */
          position: relative;
          z-index: 1;
          box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
        }

        .footer-content p {
          margin-bottom: 10px;
          font-size: 14px;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .contact-link {
          color: #333; /* Darker link text */
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .contact-link:hover {
          color: #03A9F4; /* Soothing blue on hover */
        }

        .copyright {
          font-size: 12px;
          color: #888; /* Even lighter copyright text */
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .app {
            padding: 16px;
          }

          .header {
            padding: 20px;
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .app-title {
            font-size: 24px;
          }

          .nav-tabs {
            flex-direction: column;
            gap: 4px;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .form-container {
            padding: 24px;
          }

          .color-group {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .charges-grid {
            grid-template-columns: 1fr;
          }

          .payment-card {
            padding: 24px;
          }

          .payment-amount span {
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 22px;
          }

          .company-name {
            font-size: 18px;
          }

          .page-title {
            font-size: 20px;
          }

          .services-grid {
            gap: 12px;
          }

          .service-item {
            padding: 16px;
          }

          .service-text {
            font-size: 14px;
          }

          .contact-info {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>

      {/* Render different pages based on currentPage state */}
      {currentPage === 'main' && (
        <>
          <div className="header">
            <div className="header-content">
              <div className="logo-section">
                <div className="logo">₹</div>
                <div>
                  <h1 className="app-title">Money Holdings</h1>
                  <p className="app-subtitle">Investment Company Portfolio Manager</p>
                </div>
              </div>
              <div className="header-actions">
                <button onClick={() => setCurrentPage('create')} className="add-btn">
                  <Plus size={16} />
                  Add Company
                </button>
              </div>
            </div>
          </div>

          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              <Grid3X3 size={16} />
              Browse
            </button>
            <button
              className={`nav-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <Bookmark size={16} />
              Saved ({savedNames.length})
            </button>
          </div>

          <div className="main-content">
            <MainContent />
          </div>
          <Footer /> {/* Footer component included here */}
        </>
      )}

      {currentPage === 'create' && <CreateNewPage />}
      {currentPage === 'edit' && <EditPage />}
      {currentPage === 'services' && <ServicesOfferedPage />}
      {currentPage === 'charges' && <ConsultancyChargesPage />}
      {currentPage === 'payment' && <PaymentPage />}
    </div>
  );
};

export default MoneyHoldingsApp;