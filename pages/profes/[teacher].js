import React from "react";

import { useRouter } from 'next/router'

const TeacherPage = () => {
    const router = useRouter()
  const { teacher } = router.query

  return <p>teacher: {teacher}</p>
}

export default TeacherPage;