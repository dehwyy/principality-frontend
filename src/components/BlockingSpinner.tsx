import { FC } from 'react'
import { Spinner } from 'react-bootstrap'
import './BlockingSpinner.css'

export const BlockingSpinner: FC = () => (
  <div className="blockingSpinner">
    <Spinner animation="border" />
  </div>
)
