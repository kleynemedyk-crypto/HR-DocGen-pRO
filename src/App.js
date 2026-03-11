import { useState, useEffect } from "react";

// ─── DATA & CONSTANTS ────────────────────────────────────────────────────────

const CURRENT_USER = { id: 1, name: "Sophie Moreau", role: "admin", avatar: "SM" };

const INITIAL_TEMPLATES = [
  {
    id: 1, name: "Contrat CDI", type: "Contrat de travail", category: "Contrats",
    icon: "📄", color: "#1a6b4a",
    fields: ["nom", "prenom", "poste", "date_embauche", "salaire", "lieu_travail", "periode_essai"],
    description: "Contrat à durée indéterminée standard",
    createdAt: "2025-01-10", usageCount: 47,
  },
  {
    id: 2, name: "Contrat CDD", type: "Contrat de travail", category: "Contrats",
    icon: "📋", color: "#2563a8",
    fields: ["nom", "prenom", "poste", "date_embauche", "date_fin", "salaire", "motif_cdd"],
    description: "Contrat à durée déterminée",
    createdAt: "2025-01-10", usageCount: 23,
  },
  {
    id: 3, name: "Convention de Stage", type: "Convention de stage", category: "Stages",
    icon: "🎓", color: "#7c3aed",
    fields: ["nom", "prenom", "etablissement", "filiere", "date_debut", "date_fin", "tuteur", "gratification"],
    description: "Convention tripartite école-étudiant-entreprise",
    createdAt: "2025-02-01", usageCount: 18,
  },
  {
    id: 4, name: "Attestation de Travail", type: "Attestation", category: "Attestations",
    icon: "✅", color: "#b45309",
    fields: ["nom", "prenom", "poste", "date_embauche", "type_contrat"],
    description: "Attestation certifiant l'emploi actuel",
    createdAt: "2025-01-15", usageCount: 62,
  },
  {
    id: 5, name: "Certificat de Travail", type: "Certificat", category: "Attestations",
    icon: "🏆", color: "#be185d",
    fields: ["nom", "prenom", "poste", "date_embauche", "date_fin_contrat", "type_contrat"],
    description: "Certificat de fin de contrat",
    createdAt: "2025-01-20", usageCount: 15,
  },
  {
    id: 6, name: "Avenant au Contrat", type: "Avenant", category: "Contrats",
    icon: "📝", color: "#0f766e",
    fields: ["nom", "prenom", "poste_actuel", "nouveau_poste", "nouveau_salaire", "date_effet"],
    description: "Modification des termes du contrat initial",
    createdAt: "2025-03-01", usageCount: 9,
  },
];

const FIELD_LABELS = {
  nom: "Nom", prenom: "Prénom", poste: "Poste occupé",
  date_embauche: "Date d'embauche", salaire: "Salaire brut mensuel (FCFA)",
  lieu_travail: "Lieu de travail", periode_essai: "Période d'essai",
  date_fin: "Date de fin", motif_cdd: "Motif du CDD",
  etablissement: "Établissement scolaire", filiere: "Filière / Spécialité",
  date_debut: "Date de début", tuteur: "Maître de stage",
  gratification: "Gratification mensuelle", type_contrat: "Type de contrat",
  date_fin_contrat: "Date de fin de contrat",
  poste_actuel: "Poste actuel", nouveau_poste: "Nouveau poste",
  nouveau_salaire: "Nouveau salaire", date_effet: "Date d'effet",
};

const FIELD_TYPES = {
  date_embauche: "date", date_fin: "date", date_debut: "date",
  date_fin_contrat: "date", date_effet: "date",
  salaire: "number", gratification: "number", nouveau_salaire: "number",
};

const INITIAL_HISTORY = [
  { id: 101, template: "Contrat CDI", beneficiary: "Diallo Mamadou", date: "2026-03-08", author: "Sophie Moreau", status: "generated" },
  { id: 102, template: "Attestation de Travail", beneficiary: "Koné Fatima", date: "2026-03-07", author: "Sophie Moreau", status: "generated" },
  { id: 103, template: "Convention de Stage", beneficiary: "Traoré Ibrahima", date: "2026-03-05", author: "Sophie Moreau", status: "generated" },
  { id: 104, template: "Contrat CDD", beneficiary: "Bah Aissatou", date: "2026-03-01", author: "Sophie Moreau", status: "generated" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function generateDocumentContent(template, values) {
  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const companyName = "ENTREPRISE SAS";
  const companyAddress = "123 Avenue de la République, Dakar, Sénégal";

  const replace = (text) =>
    Object.entries(values).reduce((t, [k, v]) => {
      const display = FIELD_TYPES[k] === "date" ? formatDate(v) : (v || `[${k}]`);
      return t.replaceAll(`{{${k}}}`, display);
    }, text);

  const templates_content = {
    "Contrat CDI": `CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE

Entre les soussignés :

${companyName}
Siège social : ${companyAddress}
Représentée par son Directeur des Ressources Humaines

d'une part,

Et :

Monsieur/Madame ${replace("{{prenom}} {{nom}}")}

d'autre part,

Il a été convenu et arrêté ce qui suit :

ARTICLE 1 – ENGAGEMENT
${companyName} engage Monsieur/Madame ${replace("{{prenom}} {{nom}}")} à compter du ${replace("{{date_embauche}}")} en qualité de ${replace("{{poste}}")}, dans le cadre d'un contrat à durée indéterminée.

ARTICLE 2 – PÉRIODE D'ESSAI
Le présent contrat est soumis à une période d'essai de ${replace("{{periode_essai}}")} à compter de la date de prise de poste.

ARTICLE 3 – RÉMUNÉRATION
En contrepartie de ses fonctions, le salarié percevra une rémunération brute mensuelle de ${replace("{{salaire}}")} FCFA.

ARTICLE 4 – LIEU DE TRAVAIL
Le salarié exercera ses fonctions à ${replace("{{lieu_travail}}")}.

ARTICLE 5 – DURÉE DU TRAVAIL
La durée du travail est fixée à 40 heures par semaine conformément à la législation en vigueur.

Fait à Dakar, le ${today}

Pour l'Employeur,                    Le Salarié,
(Signature & Cachet)                 (Signature précédée de la mention « Lu et approuvé »)`,

    "Attestation de Travail": `ATTESTATION DE TRAVAIL

Je soussigné(e), Directeur des Ressources Humaines de ${companyName},

CERTIFIE

que Monsieur/Madame ${replace("{{prenom}} {{nom}}")} est actuellement employé(e) au sein de notre société en qualité de ${replace("{{poste}}")}, dans le cadre d'un ${replace("{{type_contrat}}")}, depuis le ${replace("{{date_embauche}}")}.

Cette attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.

Fait à Dakar, le ${today}

Le Directeur des Ressources Humaines
(Signature & Cachet)`,

    default: `DOCUMENT ADMINISTRATIF RH

Type : ${template.type}
Référence : DOC-${Date.now()}
Date d'émission : ${today}

BÉNÉFICIAIRE :
${replace("{{prenom}} {{nom}}")}

${template.fields.map(f => `${FIELD_LABELS[f] || f} : ${replace(`{{${f}}}`)}`).join("\n")}

Fait à Dakar, le ${today}

Pour ${companyName},
Le Directeur des Ressources Humaines
(Signature & Cachet)`,
  };

  return templates_content[template.name] || templates_content.default;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Avatar({ initials, size = 36, color = "#1a6b4a" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
      fontFamily: "'DM Serif Display', serif",
    }}>{initials}</div>
  );
}

function Badge({ label, color }) {
  const colors = {
    Contrats: { bg: "#dcfce7", text: "#166534" },
    Stages: { bg: "#ede9fe", text: "#5b21b6" },
    Attestations: { bg: "#fef3c7", text: "#92400e" },
    generated: { bg: "#d1fae5", text: "#065f46" },
  };
  const c = colors[color || label] || { bg: "#f1f5f9", text: "#475569" };
  return (
    <span style={{
      background: c.bg, color: c.text, padding: "2px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
    }}>{label}</span>
  );
}

function Stat({ value, label, icon }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "20px 24px",
      border: "1px solid #e8ecf0", display: "flex", alignItems: "center", gap: 16,
      transition: "box-shadow 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1, fontFamily: "'DM Serif Display', serif" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── VIEWS ────────────────────────────────────────────────────────────────────

function Dashboard({ templates, history, onNewDoc, onGoTo }) {
  const recentHistory = history.slice(0, 4);
  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* Welcome */}
      <div style={{
        background: "linear-gradient(135deg, #0f4c35 0%, #1a6b4a 60%, #2d8a64 100%)",
        borderRadius: 20, padding: "32px 36px", marginBottom: 32, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -20, right: 60, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "relative" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>Bonjour,</p>
          <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 8px", fontFamily: "'DM Serif Display', serif" }}>
            {CURRENT_USER.name} 👋
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, margin: "0 0 24px" }}>
            Générez vos documents RH en moins de 30 secondes
          </p>
          <button onClick={onNewDoc} style={{
            background: "#fff", color: "#0f4c35", border: "none",
            padding: "11px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>+</span> Nouveau document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        <Stat value={history.length} label="Documents générés" icon="📄" />
        <Stat value={templates.length} label="Modèles disponibles" icon="📁" />
        <Stat value={recentHistory.length} label="Cette semaine" icon="📅" />
        <Stat value="< 30s" label="Temps de génération" icon="⚡" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent history */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Activité récente</h3>
            <button onClick={() => onGoTo("history")} style={{ background: "none", border: "none", color: "#1a6b4a", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              Tout voir →
            </button>
          </div>
          {recentHistory.map(h => (
            <div key={h.id} style={{ padding: "14px 24px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📄</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.beneficiary}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{h.template} · {new Date(h.date).toLocaleDateString("fr-FR")}</div>
              </div>
              <Badge label="Généré" color="generated" />
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Modèles fréquents</h3>
          </div>
          {templates.slice(0, 4).map(t => (
            <div key={t.id} style={{ padding: "14px 24px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{t.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{t.usageCount} utilisations</div>
              </div>
              <button onClick={onNewDoc} style={{
                background: t.color + "12", color: t.color, border: `1px solid ${t.color}30`,
                padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>Générer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplatesView({ templates, setTemplates, onGenerate }) {
  const [showUpload, setShowUpload] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: "", type: "", category: "Contrats", icon: "📄", fields: [], description: "", color: "#1a6b4a" });
  const [fieldInput, setFieldInput] = useState("");
  const [search, setSearch] = useState("");

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const addField = () => {
    const f = fieldInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (f && !newTemplate.fields.includes(f)) {
      setNewTemplate(p => ({ ...p, fields: [...p.fields, f] }));
      setFieldInput("");
    }
  };

  const saveTemplate = () => {
    if (!newTemplate.name || !newTemplate.type) return;
    setTemplates(p => [...p, { ...newTemplate, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], usageCount: 0 }]);
    setNewTemplate({ name: "", type: "", category: "Contrats", icon: "📄", fields: [], description: "", color: "#1a6b4a" });
    setShowUpload(false);
  };

  const deleteTemplate = (id) => setTemplates(p => p.filter(t => t.id !== id));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Serif Display', serif" }}>Modèles de documents</h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>{templates.length} modèles disponibles</p>
        </div>
        {CURRENT_USER.role === "admin" && (
          <button onClick={() => setShowUpload(true)} style={{
            background: "#1a6b4a", color: "#fff", border: "none",
            padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>+ Nouveau modèle</button>
        )}
      </div>

      <input placeholder="Rechercher un modèle…" value={search} onChange={e => setSearch(e.target.value)} style={{
        width: "100%", padding: "10px 16px", borderRadius: 10, border: "1px solid #e2e8f0",
        fontSize: 14, marginBottom: 20, boxSizing: "border-box", outline: "none",
      }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {filtered.map(t => (
          <div key={t.id} style={{
            background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0",
            overflow: "hidden", transition: "box-shadow 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <div style={{ height: 6, background: t.color }} />
            <div style={{ padding: "20px 20px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: t.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{t.icon}</div>
                <Badge label={t.category} />
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{t.name}</h3>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{t.description}</p>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>
                {t.fields.length} champs · {t.usageCount} utilisations · Créé le {new Date(t.createdAt).toLocaleDateString("fr-FR")}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onGenerate(t)} style={{
                  flex: 1, background: t.color, color: "#fff", border: "none",
                  padding: "8px 0", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>Générer</button>
                {CURRENT_USER.role === "admin" && (
                  <button onClick={() => deleteTemplate(t.id)} style={{
                    background: "#fff1f2", color: "#e11d48", border: "1px solid #fecdd3",
                    padding: "8px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  }}>🗑</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={() => setShowUpload(false)}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 520,
            maxHeight: "90vh", overflowY: "auto",
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 800, fontFamily: "'DM Serif Display', serif" }}>Nouveau modèle de document</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Nom du modèle *</label>
                <input value={newTemplate.name} onChange={e => setNewTemplate(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Contrat CDI Senior" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Type de document *</label>
                <input value={newTemplate.type} onChange={e => setNewTemplate(p => ({ ...p, type: e.target.value }))}
                  placeholder="Ex: Contrat de travail" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Catégorie</label>
                <select value={newTemplate.category} onChange={e => setNewTemplate(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                  <option>Contrats</option><option>Stages</option><option>Attestations</option><option>Avenants</option><option>Autres</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Description</label>
                <input value={newTemplate.description} onChange={e => setNewTemplate(p => ({ ...p, description: e.target.value }))}
                  placeholder="Brève description du document" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Champs dynamiques</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input value={fieldInput} onChange={e => setFieldInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addField()}
                    placeholder="Ex: nom, poste, salaire…" style={{ ...inputStyle, flex: 1, margin: 0 }} />
                  <button onClick={addField} style={{
                    background: "#1a6b4a", color: "#fff", border: "none",
                    padding: "0 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer",
                  }}>+ Ajouter</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {newTemplate.fields.map(f => (
                    <span key={f} style={{ background: "#f0fdf4", color: "#166534", padding: "3px 10px", borderRadius: 20, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                      {`{{${f}}}`}
                      <span style={{ cursor: "pointer", fontWeight: 700 }} onClick={() => setNewTemplate(p => ({ ...p, fields: p.fields.filter(x => x !== f) }))}>×</span>
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                <button onClick={() => setShowUpload(false)} style={{
                  flex: 1, background: "#f8fafc", color: "#374151", border: "1px solid #e2e8f0",
                  padding: "10px 0", borderRadius: 10, fontWeight: 600, cursor: "pointer",
                }}>Annuler</button>
                <button onClick={saveTemplate} style={{
                  flex: 2, background: "#1a6b4a", color: "#fff", border: "none",
                  padding: "10px 0", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                }}>Enregistrer le modèle</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0",
  fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

function GenerateView({ templates, onGenerated, preselectedTemplate }) {
  const [step, setStep] = useState(1); // 1: choose, 2: fill, 3: preview
  const [selectedTemplate, setSelectedTemplate] = useState(preselectedTemplate || null);
  const [values, setValues] = useState({});
  const [docContent, setDocContent] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (preselectedTemplate) {
      setSelectedTemplate(preselectedTemplate);
      setStep(2);
    }
  }, [preselectedTemplate]);

  const handleSelect = (t) => { setSelectedTemplate(t); setValues({}); setStep(2); };

  const handleGenerate = () => {
    const content = generateDocumentContent(selectedTemplate, values);
    setDocContent(content);
    onGenerated({ template: selectedTemplate.name, beneficiary: `${values.prenom || ""} ${values.nom || ""}`.trim() || "Inconnu", values });
    setStep(3);
  };

  const downloadDoc = () => {
    const blob = new Blob([docContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate.name}_${values.nom || "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendEmail = () => { setEmailSent(true); setTimeout(() => setEmailSent(false), 3000); };

  const allFilled = selectedTemplate?.fields.every(f => values[f] && values[f].trim?.() !== "");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: step >= s ? "#1a6b4a" : "#e8ecf0",
              color: step >= s ? "#fff" : "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
            }}>{s}</div>
            <span style={{ fontSize: 13, color: step >= s ? "#0f172a" : "#94a3b8", fontWeight: step === s ? 600 : 400 }}>
              {["Choisir un modèle", "Remplir le formulaire", "Générer & télécharger"][s - 1]}
            </span>
            {s < 3 && <div style={{ width: 32, height: 2, background: step > s ? "#1a6b4a" : "#e8ecf0", marginLeft: 4 }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Sélectionnez un type de document</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {templates.map(t => (
              <div key={t.id} onClick={() => handleSelect(t)} style={{
                background: "#fff", borderRadius: 14, border: "2px solid #e8ecf0",
                padding: "20px", cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.boxShadow = `0 4px 20px ${t.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8ecf0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{t.fields.length} champs à remplir</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedTemplate && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ fontSize: 28 }}>{selectedTemplate.icon}</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{selectedTemplate.name}</h3>
              <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: 13 }}>Remplissez tous les champs obligatoires</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {selectedTemplate.fields.map(field => (
              <div key={field}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  {FIELD_LABELS[field] || field} <span style={{ color: "#e11d48" }}>*</span>
                </label>
                <input
                  type={FIELD_TYPES[field] || "text"}
                  value={values[field] || ""}
                  onChange={e => setValues(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={`Saisir ${(FIELD_LABELS[field] || field).toLowerCase()}`}
                  style={{
                    ...inputStyle,
                    borderColor: values[field] ? "#1a6b4a" : "#e2e8f0",
                    background: values[field] ? "#f0fdf4" : "#fff",
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setStep(1)} style={{
              background: "#f8fafc", color: "#374151", border: "1px solid #e2e8f0",
              padding: "11px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer",
            }}>← Retour</button>
            <button onClick={handleGenerate} disabled={!allFilled} style={{
              background: allFilled ? "#1a6b4a" : "#94a3b8", color: "#fff", border: "none",
              padding: "11px 32px", borderRadius: 10, fontWeight: 700, fontSize: 14,
              cursor: allFilled ? "pointer" : "not-allowed", flex: 1,
            }}>
              ⚡ Générer le document
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12,
            padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, color: "#166534" }}>Document généré avec succès !</div>
              <div style={{ fontSize: 13, color: "#166534" }}>
                {selectedTemplate.name} pour {values.prenom} {values.nom}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden" }}>
              <div style={{ background: "#f8fafc", padding: "12px 20px", borderBottom: "1px solid #e8ecf0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>📄 Aperçu du document</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{selectedTemplate.name}</span>
              </div>
              <pre style={{
                margin: 0, padding: 24, fontSize: 12.5, lineHeight: 1.8,
                fontFamily: "'Courier New', monospace", color: "#374151",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                maxHeight: 480, overflowY: "auto",
              }}>{docContent}</pre>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: 20 }}>
                <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Actions</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={downloadDoc} style={{
                    background: "#1a6b4a", color: "#fff", border: "none",
                    padding: "11px 16px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                  }}>⬇ Télécharger (.docx)</button>
                  <button onClick={downloadDoc} style={{
                    background: "#dc2626", color: "#fff", border: "none",
                    padding: "11px 16px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                  }}>⬇ Télécharger (PDF)</button>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: 20 }}>
                <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>📧 Envoyer par email</h4>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="destinataire@email.com" style={{ ...inputStyle, marginBottom: 10 }} />
                <button onClick={sendEmail} disabled={!email} style={{
                  width: "100%", background: email ? "#2563a8" : "#94a3b8", color: "#fff", border: "none",
                  padding: "10px", borderRadius: 10, fontWeight: 700, cursor: email ? "pointer" : "not-allowed",
                }}>
                  {emailSent ? "✅ Email envoyé !" : "Envoyer"}
                </button>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: 20 }}>
                <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>✍ Signature électronique</h4>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#64748b" }}>Demander une signature électronique sécurisée</p>
                <button style={{
                  width: "100%", background: "#f8fafc", color: "#374151", border: "1px solid #e2e8f0",
                  padding: "10px", borderRadius: 10, fontWeight: 600, cursor: "pointer",
                }}>Demander une signature</button>
              </div>

              <button onClick={() => { setStep(1); setSelectedTemplate(null); setValues({}); }} style={{
                background: "#f8fafc", color: "#374151", border: "1px solid #e2e8f0",
                padding: "11px 16px", borderRadius: 10, fontWeight: 600, cursor: "pointer",
              }}>+ Nouveau document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryView({ history }) {
  const [search, setSearch] = useState("");
  const filtered = history.filter(h =>
    h.beneficiary.toLowerCase().includes(search.toLowerCase()) ||
    h.template.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, fontFamily: "'DM Serif Display', serif", color: "#0f172a" }}>Historique des documents</h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>{history.length} documents générés au total</p>
      </div>
      <input placeholder="Rechercher par bénéficiaire ou type…" value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: 16 }} />
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Bénéficiaire", "Type de document", "Date", "Auteur", "Statut", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((h, i) => (
              <tr key={h.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={h.beneficiary.split(" ").map(w => w[0]).join("").slice(0, 2)} size={32} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{h.beneficiary}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 14, color: "#374151" }}>{h.template}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>{new Date(h.date).toLocaleDateString("fr-FR")}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>{h.author}</td>
                <td style={{ padding: "14px 16px" }}><Badge label="Généré" color="generated" /></td>
                <td style={{ padding: "14px 16px" }}>
                  <button style={{
                    background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0",
                    padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>⬇ Télécharger</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Aucun résultat</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("dashboard");
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [preselectedTemplate, setPreselectedTemplate] = useState(null);

  const handleNewDoc = () => { setPreselectedTemplate(null); setView("generate"); };
  const handleGenerate = (t) => { setPreselectedTemplate(t); setView("generate"); };
  const handleGenerated = ({ template, beneficiary }) => {
    setHistory(p => [{
      id: Date.now(), template, beneficiary,
      date: new Date().toISOString().split("T")[0],
      author: CURRENT_USER.name, status: "generated",
    }, ...p]);
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de bord", icon: "🏠" },
    { id: "generate", label: "Nouveau document", icon: "⚡" },
    { id: "templates", label: "Modèles", icon: "📁" },
    { id: "history", label: "Historique", icon: "🕐" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f4f7f9", minHeight: "100vh", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        button { transition: all 0.15s; }
        button:hover:not(:disabled) { filter: brightness(0.93); }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: 240, background: "#0f172a", minHeight: "100vh",
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #1a6b4a, #2d8a64)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>📄</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "'DM Serif Display', serif" }}>HR DocGen</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>v2.0 · Administrateur</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, padding: "0 8px" }}>Navigation</div>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, border: "none",
              background: view === item.id ? "rgba(26,107,74,0.2)" : "transparent",
              color: view === item.id ? "#4ade80" : "#94a3b8",
              fontSize: 14, fontWeight: view === item.id ? 700 : 500,
              cursor: "pointer", textAlign: "left", marginBottom: 2,
              borderLeft: view === item.id ? "3px solid #1a6b4a" : "3px solid transparent",
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.id === "history" && <span style={{ marginLeft: "auto", background: "#1e293b", color: "#64748b", borderRadius: 12, padding: "1px 7px", fontSize: 11 }}>{history.length}</span>}
            </button>
          ))}

          <div style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 8px", padding: "0 8px" }}>Admin</div>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10, border: "none",
            background: "transparent", color: "#94a3b8", fontSize: 14, cursor: "pointer", textAlign: "left",
            borderLeft: "3px solid transparent",
          }}>
            <span>👥</span> Utilisateurs
          </button>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10, border: "none",
            background: "transparent", color: "#94a3b8", fontSize: 14, cursor: "pointer", textAlign: "left",
            borderLeft: "3px solid transparent",
          }}>
            <span>⚙️</span> Paramètres
          </button>
        </nav>

        {/* User */}
        <div style={{ padding: "16px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={CURRENT_USER.avatar} size={34} color="#1a6b4a" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{CURRENT_USER.name}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Admin RH</div>
          </div>
          <button style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>⋯</button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #e8ecf0",
          padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a", fontFamily: "'DM Serif Display', serif" }}>
              {navItems.find(n => n.id === view)?.label || "HR DocGen"}
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button style={{
              background: "#f8fafc", border: "1px solid #e2e8f0", color: "#374151",
              padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>🔔</button>
            <button onClick={handleNewDoc} style={{
              background: "#1a6b4a", color: "#fff", border: "none",
              padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>+ Nouveau document</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {view === "dashboard" && <Dashboard templates={templates} history={history} onNewDoc={handleNewDoc} onGoTo={setView} />}
          {view === "templates" && <TemplatesView templates={templates} setTemplates={setTemplates} onGenerate={handleGenerate} />}
          {view === "generate" && <GenerateView templates={templates} onGenerated={handleGenerated} preselectedTemplate={preselectedTemplate} />}
          {view === "history" && <HistoryView history={history} />}
        </div>
      </div>
    </div>
  );
}
