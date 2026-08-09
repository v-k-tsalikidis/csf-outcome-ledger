import { NistOutcome } from '../types/ledger';

export const NIST_CSF_OUTCOMES: NistOutcome[] = [
  // --- GOVERN ---
  {
    id: 'GV.OC-01',
    function: 'GOVERN',
    category: 'Organizational Context',
    description:
      'The organizational mission, risk tolerance, and cybersecurity risk management strategy are understood and inform risk decisions.',
    sp80053Controls: [
      { code: 'PM-9', title: 'Risk Management Strategy', family: 'Program Management' },
      { code: 'RA-3', title: 'Risk Assessment', family: 'Risk Assessment' }
    ],
    iso27001Controls: [
      { code: 'A.5.1', title: 'Policies for information security' },
      { code: 'A.5.4', title: 'Management responsibilities' }
    ],
    doraMapping: { article: 'Art. 5', title: 'ICT Risk Governance Framework' },
    nis2Mapping: {
      article: 'Art. 21.1',
      title: 'Policies on risk analysis and info security'
    }
  },
  {
    id: 'GV.RM-01',
    function: 'GOVERN',
    category: 'Risk Management Strategy',
    description:
      'Risk management objectives, risk appetite, and risk tolerances are established, communicated, and updated.',
    sp80053Controls: [
      { code: 'PM-28', title: 'Risk Frame', family: 'Program Management' },
      { code: 'RA-2', title: 'Security Categorization', family: 'Risk Assessment' }
    ],
    iso27001Controls: [
      { code: 'A.5.2', title: 'Information security roles and responsibilities' }
    ],
    doraMapping: { article: 'Art. 6', title: 'ICT Risk Management System' },
    nis2Mapping: { article: 'Art. 21.2a', title: 'Governance and Risk Appetite' }
  },
  {
    id: 'GV.SC-01',
    function: 'GOVERN',
    category: 'Cybersecurity Supply Chain Risk',
    description:
      'Cybersecurity supply chain risk management processes are established, managed, and monitored for third-party providers.',
    sp80053Controls: [
      {
        code: 'SR-3',
        title: 'Supply Chain Controls and Processes',
        family: 'Supply Chain Risk'
      },
      {
        code: 'SR-5',
        title: 'Acquisition Strategies, Tools, and Methods',
        family: 'Supply Chain Risk'
      }
    ],
    iso27001Controls: [
      { code: 'A.5.19', title: 'Information security in supplier relationships' }
    ],
    doraMapping: { article: 'Art. 28', title: 'Managing ICT Third-Party Risk' },
    nis2Mapping: {
      article: 'Art. 21.2d',
      title: 'Supply Chain Security & Supplier Relationships'
    }
  },

  // --- IDENTIFY ---
  {
    id: 'ID.AM-01',
    function: 'IDENTIFY',
    category: 'Asset Management',
    description:
      'Inventories of physical and software assets, data flows, and external interfaces are maintained and prioritized based on risk.',
    sp80053Controls: [
      {
        code: 'CM-8',
        title: 'Information System Component Inventory',
        family: 'Configuration Management'
      },
      { code: 'PM-5', title: 'System Inventory', family: 'Program Management' }
    ],
    iso27001Controls: [
      { code: 'A.5.9', title: 'Inventory of information and associated assets' },
      { code: 'A.5.10', title: 'Acceptable use of assets' }
    ],
    doraMapping: { article: 'Art. 8', title: 'Identification & Asset Management' },
    nis2Mapping: { article: 'Art. 21.2a', title: 'Asset & Risk Management Policies' }
  },
  {
    id: 'ID.RA-01',
    function: 'IDENTIFY',
    category: 'Risk Assessment',
    description:
      'Asset vulnerabilities are identified, validated, and documented in vulnerability registers.',
    sp80053Controls: [
      {
        code: 'RA-5',
        title: 'Vulnerability Monitoring and Scanning',
        family: 'Risk Assessment'
      },
      { code: 'SI-2', title: 'Flaw Remediation', family: 'System Integrity' }
    ],
    iso27001Controls: [
      { code: 'A.8.8', title: 'Management of technical vulnerabilities' }
    ],
    doraMapping: { article: 'Art. 8.4', title: 'Continuous Vulnerability Assessments' },
    nis2Mapping: { article: 'Art. 21.2c', title: 'Vulnerability Handling & Disclosure' }
  },

  // --- PROTECT ---
  {
    id: 'PR.AA-01',
    function: 'PROTECT',
    category: 'Identity Management, Authentication & Access Control',
    description:
      'Identities and credentials for authorized users, services, and hardware are managed and authenticated using strong Multi-Factor Authentication (MFA).',
    sp80053Controls: [
      { code: 'AC-2', title: 'Account Management', family: 'Access Control' },
      { code: 'AC-3', title: 'Access Enforcement', family: 'Access Control' },
      {
        code: 'IA-2',
        title: 'Identification and Authentication',
        family: 'Identification & Auth'
      }
    ],
    iso27001Controls: [
      { code: 'A.5.15', title: 'Access control' },
      { code: 'A.8.5', title: 'Secure authentication' }
    ],
    doraMapping: {
      article: 'Art. 9',
      title: 'Protection & Prevention / Access Control'
    },
    nis2Mapping: {
      article: 'Art. 21.2j',
      title: 'Multi-factor Authentication (MFA) & Secure Comms'
    }
  },
  {
    id: 'PR.DS-01',
    function: 'PROTECT',
    category: 'Data Security',
    description:
      'Data-at-rest and data-in-transit are protected using certified cryptographic mechanisms and strict access control policies.',
    sp80053Controls: [
      {
        code: 'SC-8',
        title: 'Transmission Confidentiality and Integrity',
        family: 'System Comms'
      },
      {
        code: 'SC-28',
        title: 'Protection of Information at Rest',
        family: 'System Comms'
      }
    ],
    iso27001Controls: [
      { code: 'A.8.24', title: 'Use of cryptography' },
      { code: 'A.8.11', title: 'Data masking' }
    ],
    doraMapping: {
      article: 'Art. 9.2',
      title: 'Data Protection & Encryption Requirements'
    },
    nis2Mapping: {
      article: 'Art. 21.2h',
      title: 'Cryptography and Encryption Policies'
    }
  },
  {
    id: 'PR.PS-01',
    function: 'PROTECT',
    category: 'Platform Security',
    description:
      'Configuration baselines are established and maintained for all operational platforms, operating systems, and network hardware.',
    sp80053Controls: [
      {
        code: 'CM-2',
        title: 'Baseline Configuration',
        family: 'Configuration Management'
      },
      {
        code: 'CM-6',
        title: 'Configuration Settings',
        family: 'Configuration Management'
      }
    ],
    iso27001Controls: [{ code: 'A.8.9', title: 'Configuration management' }],
    doraMapping: {
      article: 'Art. 9.4',
      title: 'System Architecture & Baseline Hardening'
    },
    nis2Mapping: {
      article: 'Art. 21.2e',
      title: 'Security in Network System Acquisition'
    }
  },

  // --- DETECT ---
  {
    id: 'DE.CM-01',
    function: 'DETECT',
    category: 'Continuous Monitoring',
    description:
      'Networks, endpoints, and cloud infrastructure are continuously monitored to detect potential cybersecurity events and anomalous activity.',
    sp80053Controls: [
      { code: 'AU-2', title: 'Event Logging', family: 'Audit & Accountability' },
      {
        code: 'AU-6',
        title: 'Audit Record Review and Analysis',
        family: 'Audit & Accountability'
      },
      { code: 'SI-4', title: 'System Monitoring', family: 'System Integrity' }
    ],
    iso27001Controls: [
      { code: 'A.8.16', title: 'Monitoring activities' },
      { code: 'A.8.8', title: 'Technical vulnerability management' }
    ],
    doraMapping: {
      article: 'Art. 10',
      title: 'Anomalous Activity Detection & SOC Operations'
    },
    nis2Mapping: {
      article: 'Art. 21.2c',
      title: 'Continuous Vulnerability & Threat Monitoring'
    }
  },
  {
    id: 'DE.AE-01',
    function: 'DETECT',
    category: 'Adverse Event Analysis',
    description:
      'Anomalous events are analyzed to understand attack vectors, impact, and correlation with threat intelligence indicators (CTI).',
    sp80053Controls: [
      {
        code: 'SI-5',
        title: 'Security Alerts and Advisories',
        family: 'System Integrity'
      },
      {
        code: 'AU-12',
        title: 'Audit Record Generation',
        family: 'Audit & Accountability'
      }
    ],
    iso27001Controls: [{ code: 'A.8.15', title: 'Logging' }],
    doraMapping: {
      article: 'Art. 10.2',
      title: 'Threat Intelligence & Alert Correlation'
    },
    nis2Mapping: {
      article: 'Art. 21.2c',
      title: 'Security Incident Detection & Analysis'
    }
  },

  // --- RESPOND ---
  {
    id: 'RS.MA-01',
    function: 'RESPOND',
    category: 'Incident Management & Response',
    description:
      'Incident response plans are executed, stakeholders are coordinated, and containment measures are enforced during a security event.',
    sp80053Controls: [
      { code: 'IR-4', title: 'Incident Handling', family: 'Incident Response' },
      { code: 'IR-6', title: 'Incident Reporting', family: 'Incident Response' }
    ],
    iso27001Controls: [
      { code: 'A.5.24', title: 'Incident management planning' },
      { code: 'A.5.26', title: 'Response to incidents' }
    ],
    doraMapping: { article: 'Art. 11', title: 'Response & Recovery Framework' },
    nis2Mapping: { article: 'Art. 21.2b', title: 'Incident Handling & Notification' }
  },
  {
    id: 'RS.CO-01',
    function: 'RESPOND',
    category: 'Incident Communication',
    description:
      'Personnel, executive management, legal teams, and external regulatory authorities are notified according to regulatory timelines.',
    sp80053Controls: [
      {
        code: 'IR-7',
        title: 'Incident Response Assistance',
        family: 'Incident Response'
      }
    ],
    iso27001Controls: [{ code: 'A.5.25', title: 'Assessment of security events' }],
    doraMapping: { article: 'Art. 19', title: 'Major ICT-Related Incident Reporting' },
    nis2Mapping: { article: 'Art. 23', title: 'Reporting Obligations (24h/72h)' }
  },

  // --- RECOVER ---
  {
    id: 'RC.RP-01',
    function: 'RECOVER',
    category: 'Incident Recovery Plan Execution',
    description:
      'Restoration activities are performed according to Business Impact Analysis (BIA) objectives to ensure operational continuity.',
    sp80053Controls: [
      {
        code: 'CP-9',
        title: 'Information System Backup',
        family: 'Contingency Planning'
      },
      {
        code: 'CP-10',
        title: 'Information System Recovery',
        family: 'Contingency Planning'
      }
    ],
    iso27001Controls: [
      { code: 'A.5.29', title: 'Security during disruption' },
      { code: 'A.5.30', title: 'ICT readiness for business continuity' }
    ],
    doraMapping: {
      article: 'Art. 12',
      title: 'Backup Policies & Disaster Recovery Strategies'
    },
    nis2Mapping: {
      article: 'Art. 21.2c',
      title: 'Business Continuity, Backup & Crisis Management'
    }
  }
];
