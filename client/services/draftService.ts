import { RawDraftContentState } from "draft-js";

export async function getDraftByDraftID(draftId: string) {
  const response = await fetch(`http://localhost:3000/api/draft/${draftId}`, {
    credentials: 'include'
  });
  return await response.json();
}
export async function getDrafts() {
  const response = await fetch(`http://localhost:3000/api/draft/`, {
    credentials: 'include'
  });
  return await response.json();
}

export async function getFeedDrafts() {
  const response = await fetch(`http://localhost:3000/api/draft/feed`, {
    credentials: 'include'
  });
  const res = await response.json();
  console.log(res);
  return res;
}

export async function publishDraft(content: any) {
  const data = { content: JSON.stringify(content), title: 'Page', }
  const response = await fetch(`http://localhost:3000/api/draft`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  const res = await response.json()
  console.log(res);
  return res;
}

export async function saveDraft(draftId: string,
  content: RawDraftContentState, title: string, preview: RawDraftContentState, level: string) {
  const data = { draftId: draftId, content: JSON.stringify(content), title: title, preview: JSON.stringify(preview), level: level }
  const response = await fetch(`http://localhost:3000/api/draft`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })
  const resp = await response.json();
  return resp;
}

export async function deleteDraft(draftId: string) {
  const response = await fetch(`http://localhost:3000/api/draft/${draftId}`, {
    credentials: 'include',
    method: 'DELETE'
  });
  const res = await response.json();
  console.log(res);
  return res;
}