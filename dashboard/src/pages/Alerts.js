import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Alerts.css";
import { useNavigate } from "react-router-dom";

export default function Alerts() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    severity: "all",
    protocol: "all",
    confidence: "all"
  });

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    const types = [...new Set(data.map(item => String(item.type || "")))].filter(Boolean);
    const severities = [...new Set(data.map(item => String(item.severity || "")))].filter(Boolean);
    const protocols = [...new Set(data.map(item => String(item.protocol || "")))].filter(Boolean);
    const confidences = [...new Set(data.map(item => {
      const conf = item.confidence;
      if (typeof conf === 'number') {
        if (conf >= 80) return 'High';
        if (conf >= 50) return 'Medium';
        return 'Low';
      }
      return String(conf || "");
    }))].filter(Boolean);

    return { types, severities, protocols, confidences };
  }, [data]);

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5000/alerts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        console.log(response.data);
        const formattedData = Array.isArray(response.data) ? response.data : [];

        setData(formattedData);
        setFilteredData(formattedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching alerts:", err);
        navigate("/");
        setLoading(false);
      });
  }, []);

  // Apply filters whenever filters or data change
  useEffect(() => {
    let result = Array.isArray(data) ? [...data] : [];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        const type = String(item.type || "").toLowerCase();
        const src = String(item.src || "").toLowerCase();
        const dst = String(item.dst || "").toLowerCase();
        const protocol = String(item.protocol || "").toLowerCase();
        const severity = String(item.severity || "").toLowerCase();

        return type.includes(term) ||
          src.includes(term) ||
          dst.includes(term) ||
          protocol.includes(term) ||
          severity.includes(term);
      });
    }

    // Apply dropdown filters
    if (filters.type !== "all") {
      result = result.filter(item => String(item.type || "") === filters.type);
    }
    if (filters.severity !== "all") {
      result = result.filter(item => String(item.severity || "") === filters.severity);
    }
    if (filters.protocol !== "all") {
      result = result.filter(item => String(item.protocol || "") === filters.protocol);
    }
    if (filters.confidence !== "all") {
      result = result.filter(item => {
        const conf = item.confidence;
        let confidenceLevel = "";

        if (typeof conf === 'number') {
          if (conf >= 80) confidenceLevel = 'High';
          else if (conf >= 50) confidenceLevel = 'Medium';
          else confidenceLevel = 'Low';
        } else {
          confidenceLevel = String(conf || "");
        }

        return confidenceLevel === filters.confidence;
      });
    }

    setFilteredData(result);
  }, [data, searchTerm, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      type: "all",
      severity: "all",
      protocol: "all",
      confidence: "all"
    });
  };

  const toggleAlertExpansion = (id) => {
    setExpandedAlert(expandedAlert === id ? null : id);
  };

  const getSeverityColor = (severity) => {
    const severityStr = String(severity || "").toLowerCase();
    switch (severityStr) {
      case 'critical': return '#ff4757';
      case 'high': return '#ff6b81';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence === null || confidence === undefined) return '#747d8c';

    if (typeof confidence === 'number') {
      if (confidence >= 80) return '#2ed573';
      if (confidence >= 50) return '#ffa502';
      return '#ff4757';
    }

    const confidenceStr = String(confidence).toLowerCase();
    switch (confidenceStr) {
      case 'high': return '#2ed573';
      case 'medium': return '#ffa502';
      case 'low': return '#ff4757';
      default: return '#747d8c';
    }
  };

  const getConfidenceDisplay = (confidence) => {
    if (confidence === null || confidence === undefined) return 'Unknown';

    if (typeof confidence === 'number') {
      if (confidence >= 80) return 'High';
      if (confidence >= 50) return 'Medium';
      return 'Low';
    }

    return String(confidence) || 'Unknown';
  };

  if (loading) {
    return (
      <div className="alerts-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="alerts-container">
      <header className="alerts-header">
        <h1 className="alerts-title">Security Alerts</h1>
        <div className="alerts-summary">
          <span className="total-alerts">Total: {data.length}</span>
          <span className="filtered-alerts">Showing: {filteredData.length}</span>
        </div>
      </header>

      <div className="filters-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label>Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {filterOptions.types.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Severities</option>
              {filterOptions.severities.map((severity, index) => (
                <option key={index} value={severity}>{severity}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Protocol</label>
            <select
              value={filters.protocol}
              onChange={(e) => handleFilterChange('protocol', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Protocols</option>
              {filterOptions.protocols.map((protocol, index) => (
                <option key={index} value={protocol}>{protocol}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Confidence</label>
            <select
              value={filters.confidence}
              onChange={(e) => handleFilterChange('confidence', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Confidence</option>
              {filterOptions.confidences.map((confidence, index) => (
                <option key={index} value={confidence}>{confidence}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={clearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      </div>

      {!Array.isArray(filteredData) || filteredData.length === 0 ? (
        <div className="no-alerts">
          <p>No alerts found matching your criteria</p>
        </div>
      ) : (
        <div className="alerts-grid">
          {filteredData.map((item, index) => {
            const confidenceDisplay = getConfidenceDisplay(item.confidence);
            const severityDisplay = String(item.severity || 'Unknown');

            return (
              <div
                key={index}
                className={`alert-card ${expandedAlert === index ? 'expanded' : ''}`}
                onClick={() => toggleAlertExpansion(index)}
              >
                <div className="alert-header">
                  <div className="alert-title-row">
                    <h3 className="alert-type">{String(item.type || 'Unknown')}</h3>
                    <div className="alert-badges">
                      <span
                        className="severity-badge"
                        style={{ backgroundColor: getSeverityColor(item.severity) }}
                      >
                        {severityDisplay}
                      </span>
                      <span
                        className="confidence-badge"
                        style={{ backgroundColor: getConfidenceColor(item.confidence) }}
                      >
                        {confidenceDisplay} Confidence
                      </span>
                    </div>
                  </div>
                  <div className="alert-timestamp">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown time'}
                  </div>
                </div>

                <div className="alert-summary">
                  <div className="connection-info">
                    <span className="source">{String(item.src || 'Unknown')}</span>
                    <span className="arrow">→</span>
                    <span className="destination">{String(item.dst || 'Unknown')}</span>
                  </div>
                  <div className="protocol-info">
                    <span className="protocol-tag">{String(item.protocol || 'Unknown')}</span>
                  </div>
                </div>

                {expandedAlert === index && (
                  <div className="alert-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Source:</span>
                        <span className="detail-value">{String(item.src || 'N/A')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Destination:</span>
                        <span className="detail-value">{String(item.dst || 'N/A')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Protocol:</span>
                        <span className="detail-value">{String(item.protocol || 'N/A')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Port:</span>
                        <span className="detail-value">{String(item.port || 'N/A')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Severity:</span>
                        <span
                          className="detail-value severity-value"
                          style={{ color: getSeverityColor(item.severity) }}
                        >
                          {severityDisplay}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Confidence:</span>
                        <span
                          className="detail-value confidence-value"
                          style={{ color: getConfidenceColor(item.confidence) }}
                        >
                          {confidenceDisplay} {typeof item.confidence === 'number' ? `(${item.confidence}%)` : ''}
                        </span>
                      </div>
                      {item.description && (
                        <div className="detail-item full-width">
                          <span className="detail-label">Description:</span>
                          <span className="detail-value">{String(item.description)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="alert-footer">
                  <button className="expand-btn">
                    {expandedAlert === index ? 'Show Less' : 'View Details'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}