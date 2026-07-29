// /operator has no page of its own — the builder is the only tool here.

import { redirect } from 'next/navigation';

export default function OperatorIndex() {
  redirect('/operator/atlas-builder');
}
