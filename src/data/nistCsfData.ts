import { NistOutcome } from '../types/ledger';

export const NIST_CSF_OUTCOMES: NistOutcome[] = [
  {
    id: 'GOVERN.GV-01',
    function: 'GOVERN',
    category: 'Organizational Context',
    description: 'The organizational mission, risk tolerance, and cybersecurity risk management strategy are understood and inform risk decisions.',
    sp80053Controls: [
      { code: 'PM-9', title: 'Risk Management Strategy', family: 'Program Management' },
      { code: 'RA-3', title: 'Risk Assessment', family: 'Risk Assessment' }
    ],
    iso27001Controls: [
      { code: 'A.5.1', title: 'Policies for information security' },
      { code: 'A.5.4', title: 'Management responsibilities' }
    ],
    doraMapping: { article: 'Art. 5', title: 'ICT Risk Governance Framework' },
    nis2Mapping: { article: 'Art. 21.1', title: 'Policies on risk analysis and info security' }
  },
  {
    id: 'IDENTIFY.ID-01',
    function: 'IDENTIFY',
    category: 'Asset Management',
    description: 'Inventories of physical and software assets, data flows, and external interfaces are maintained and prioritized based on risk.',
    sp80053Controls: [
      { code: 'CM-8', title: 'Information System Component Inventory', family: 'Configuration Management' },
      { code: 'PM-5', title: 'System Inventory', family: 'Program Management' }
    ],
    iso27001Controls: [
      { code: 'A.5.9', title: 'Inventory of information and other associated assets' },
      { code: 'A.5.10', title: 'Acceptable use of information and other associated assets' }
    ],
    doraMapping: { article: 'Art. 8', title: 'Identification & Asset Management' },
    nis2Mapping: { article: 'Art. 21.2a', title: 'Asset & Risk Management Policies' }
  },
  {
    id: 'PROTECT.PR.AA-01',
    function: 'PROTECT',
    category: 'Identity Management, Authentication, and Access Control',
    description: 'Identities and credentials for authorized users, services, and hardware are managed and authenticated using strong Multi-Factor Authentication (MFA).',
    sp80053Controls: [
      { code: 'AC-2', title: 'Account Management', family: 'Access Control' },
      { code: 'AC-3', title: 'Access Enforcement', family: 'Access Control' },
      { code: 'IA-2', title: 'Identification and Authentication (Organizational Users)', family: 'Identification & Auth' },
      { code: 'IA-8', title: 'Identification and Authentication (Non-Organizational Users)', family: 'Identification & Auth' }
    ],
    iso27001Controls: [
      { code: 'A.5.15', title: 'Access control' },
      { code: 'A.8.5', title: 'Secure authentication' }
    ],
    doraMapping: { article: 'Art. 9', title: 'Protection & Prevention / Access Control' },
    nis2Mapping: { article: 'Art. 21.2j', title: 'Multi-factor Authentication (MFA) & Secure Comms' }
  },
  {
    id: 'PROTECT.PR.DS-01',
    function: 'PROTECT',
    category: 'Data Security',
    description: 'Data-at-rest and data-in-transit are protected using certified cryptographic mechanisms and strict access control policies.',
    sp80053Controls: [
      { code: 'SC-8', title: 'Transmission Confidentiality and Integrity', family: 'System & Comms Protection' },
      { code: 'SC-28', title: 'Protection of Information at Rest', family: 'System & Comms Protection' }
    ],
    iso27001Controls: [
      { code: 'A.8.24', title: 'Use of cryptography' },
      { code: 'A.8.11', title: 'Data masking' }
    ],
    doraMapping: { article: 'Art. 9.2', title: 'Data Protection & Encryption Requirements' },
    nis2Mapping: { article: 'Art. 21.2h', title: 'Cryptography and Encryption Policies' }
  },
  {
    id: 'DETECT.DE.AE-01',
    function: 'DETECT',
    category: 'Adverse Event Detection & Continuous Monitoring',
    description: 'Networks, endpoints, and cloud infrastructure are continuously monitored to detect potential cybersecurity events and anomalous activity.',
    sp80053Controls: [
      { code: 'AU-2', title: 'Event Logging', family: 'Audit & Accountability' },
      { code: 'AU-6', title: 'Audit Record Review, Analysis, and Reporting', family: 'Audit & Accountability' },
      { code: 'SI-4', title: 'System Monitoring', family: 'System & Info Integrity' }
    ],
    iso27001Controls: [
      { code: 'A.8.16', title: 'Monitoring activities' },
      { code: 'A.8.8', title: 'Management of technical vulnerabilities' }
    ],
    doraMapping: { article: 'Art. 10', title: 'Anomalous Activity Detection & SOC Operations' },
    nis2Mapping: { article: 'Art. 21.2c', title: 'Continuous Vulnerability & Threat Monitoring' }
  },
  {
    id: 'RESPOND.RS.MA-01',
    function: 'RESPOND',
    category: 'Incident Management & Response',
    description: 'Incident response plans are executed, stakeholders are coordinated, and containment measures are enforced during a security event.',
    sp80053Controls: [
      { code: 'IR-4', title: 'Incident Handling', family: 'Incident Response' },
      { code: 'IR-6', title: 'Incident Reporting', family: 'Incident Response' }
    ],
    iso27001Controls: [
      { code: 'A.5.24', title: 'Information security incident management planning and preparation' },
      { code: 'A.5.26', title: 'Response to information security incidents' }
    ],
    doraMapping: { article: 'Art. 11', title: 'Response & Recovery Framework' },
    nis2Mapping: { article: 'Art. 21.2b', title: 'Incident Handling & Major Incident Notification' }
  },
  {
    id: 'RECOVER.RC.RP-01',
    function: 'RECOVER',
    category: 'Business Continuity & Disaster Recovery',
    description: 'Restoration activities are performed according to Business Impact Analysis (BIA) objectives to ensure operational continuity.',
    sp80053Controls: [
      { code: 'CP-9', title: 'Information System Backup', family: 'Contingency Planning' },
      { code: 'CP-10', title: 'Information System Recovery and Reconstitution', family: 'Contingency Planning' }
    ],
    iso27001Controls: [
      { code: 'A.5.29', title: 'Information security during disruption' },
      { code: 'A.5.30', title: 'ICT readiness for business continuity' }
    ],
    doraMapping: { article: 'Art. 12', title: 'Backup Policies & Disaster Recovery Strategies' },
    nis2Mapping: { article: 'Art. 21.2c', title: 'Business Continuity, Backup & Crisis Management' }
  }
];
