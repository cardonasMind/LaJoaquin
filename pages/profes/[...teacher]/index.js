import React from "react";

import { useRouter } from 'next/router'

const TeacherPage = () => {
    const router = useRouter()
    console.log(router)
  const { teacher } = router.query

  return <p>Maestro: {teacher}</p>
}

export default TeacherPage;