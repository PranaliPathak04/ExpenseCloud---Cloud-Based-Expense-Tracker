import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "./useAuth";

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener — updates instantly across all devices
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "expenses"),
      where("uid", "==", user.uid),
      orderBy("date", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  // Add expense (with optional receipt photo)
  const addExpense = async ({
    description,
    amount,
    category,
    date,
    receiptFile,
  }) => {
    let receiptUrl = null;
    if (receiptFile) {
      const storageRef = ref(
        storage,
        `receipts/${user.uid}/${Date.now()}_${receiptFile.name}`,
      );
      await uploadBytes(storageRef, receiptFile);
      receiptUrl = await getDownloadURL(storageRef);
    }
    await addDoc(collection(db, "expenses"), {
      uid: user.uid,
      description,
      amount: parseFloat(amount),
      category,
      date,
      receiptUrl,
      createdAt: serverTimestamp(),
    });
  };

  const deleteExpense = (id) => deleteDoc(doc(db, "expenses", id));

  const updateExpense = (id, data) => updateDoc(doc(db, "expenses", id), data);

  // Aggregations
  const totalByCategory = () =>
    expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

  const totalThisMonth = () => {
    const now = new Date();
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return expenses
      .filter((e) => e.date?.startsWith(prefix))
      .reduce((s, e) => s + e.amount, 0);
  };

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    updateExpense,
    totalByCategory,
    totalThisMonth,
  };
  console.log(user);
}
