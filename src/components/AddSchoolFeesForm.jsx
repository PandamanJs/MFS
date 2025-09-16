import styles from "../styles/AddSchoolFeesForm.module.css";
import { useEffect, useState } from "react";
import { getFeeTypes, getAcademicYears, getAcademicTerms, requestStudentFee } from "../services/api";

function AddSchoolFeesForm({ student }) {
  const [feeTypes, setFeeTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [form, setForm] = useState({ fee_type_id: "", academic_year_id: "", academic_term_id: "", amount: "", due_date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [feeTypesRes, yearsRes, termsRes] = await Promise.all([
          getFeeTypes(),
          getAcademicYears(),
          getAcademicTerms(),
        ]);
        
        if (feeTypesRes.success) setFeeTypes(feeTypesRes.data || []);
        if (yearsRes.success) setYears(yearsRes.data || []);
        if (termsRes.success) setTerms(termsRes.data || []);
        
        if (!feeTypesRes.success || !yearsRes.success || !termsRes.success) {
          setError("Failed to load form options");
        }
      } catch (err) {
        setError("Failed to load form options");
      }
    }
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await requestStudentFee({
        student_id: student.id,
        fee_type_id: form.fee_type_id,
        academic_year_id: form.academic_year_id,
        academic_term_id: form.academic_term_id,
        amount: parseFloat(form.amount),
        due_date: form.due_date
      });
      
      if (!result.success) throw new Error(result.error || "Failed to request fee");
      setSuccess("Fee request submitted successfully.");
      setForm({ fee_type_id: "", academic_year_id: "", academic_term_id: "", amount: "", due_date: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!student) return <div className={styles.message}>Select a student to add school fees.</div>;

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h3 className={styles.header}>+ Add School Fees</h3>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      <div className={styles.fieldGroup}>
        <label htmlFor="fee_type_id">Fee Type</label>
        <select id="fee_type_id" name="fee_type_id" className={styles.select} value={form.fee_type_id} onChange={handleChange} required>
          <option value="">Select Fee Type</option>
          {feeTypes.map((ft) => (
            <option key={ft.id} value={ft.id}>{ft.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="academic_year_id">Academic Year</label>
        <select id="academic_year_id" name="academic_year_id" className={styles.select} value={form.academic_year_id} onChange={handleChange} required>
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y.id} value={y.id}>{y.year_name}</option>
          ))}
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="academic_term_id">Academic Term</label>
        <select id="academic_term_id" name="academic_term_id" className={styles.select} value={form.academic_term_id} onChange={handleChange} required>
          <option value="">Select Term</option>
          {terms.map((t) => (
            <option key={t.id} value={t.id}>{t.term_name}</option>
          ))}
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="amount">Amount</label>
        <input id="amount" name="amount" type="number" className={styles.select} value={form.amount} onChange={handleChange} required min="0" step="0.01" />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="due_date">Due Date</label>
        <input id="due_date" name="due_date" type="date" className={styles.select} value={form.due_date} onChange={handleChange} required />
      </div>
      <button className={styles.doneButton} type="submit" disabled={loading}>{loading ? "Submitting..." : "Done"}</button>
    </form>
  );
}

export default AddSchoolFeesForm;
