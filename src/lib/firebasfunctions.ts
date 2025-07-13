import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData
} from "firebase/firestore";
import { Chemical } from "../components/FormulaPage"; // adjust if needed

const CHEMICALS_COLLECTION = "chemicals";

// 🔽 Fetch all chemicals from Firestore
export async function fetchChemicals(): Promise<Chemical[]> {
  const snapshot = await getDocs(collection(db, CHEMICALS_COLLECTION));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Chemical, "id">),
  }));
}

// 🔼 Add a new chemical to Firestore
export async function addChemicalToFirebase(
  chemical: Omit<Chemical, "id">
): Promise<void> {
  await addDoc(collection(db, CHEMICALS_COLLECTION), chemical);
}

// ✏️ Update an existing chemical in Firestore
export async function updateChemicalInFirebase(
  id: string,
  data: Omit<Chemical, "id">
): Promise<void> {
  const ref = doc(db, CHEMICALS_COLLECTION, id);
  await updateDoc(ref, data);
}

// ❌ Delete a chemical from Firestore
export async function deleteChemicalFromFirebase(id: string): Promise<void> {
  const ref = doc(db, CHEMICALS_COLLECTION, id);
  await deleteDoc(ref);
}
