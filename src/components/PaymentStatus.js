import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const PaymentStatus = ({ teilnahmeId }) => {
  const [openPayments, setOpenPayments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('rate')
          .select('*', { count: 'exact' })
          .eq('teilnahme_id', teilnahmeId)
          .eq('ist_bezahlt', false);
        
        if (error) throw error;
        setOpenPayments(data.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [teilnahmeId]);

  if (loading) return <span className="spinner-border spinner-border-sm"></span>;
  if (error) return <span className="text-danger">!</span>;

  return (
    <span className={`badge ${openPayments > 0 ? 'bg-warning' : 'bg-success'}`}>
      {openPayments} offen
    </span>
  );
};

export default PaymentStatus;