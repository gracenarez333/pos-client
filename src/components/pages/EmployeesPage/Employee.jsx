import React, { useState } from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { Toggle } from "../../ui/Toggle"
import { getAuthOptions } from "../../../helpers/utils"

import UserIcon from "./UserIcon"
import VerifiedIcon from "./VerifiedIcon"

export default function Employee({
  _id,
  username,
  role,
  setHasUpdated,
  setError,
  gridStyles,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [nameValue, setNameValue] = useState(username)

  const preventTailwindPurge = (
    <span className="bg-slate-700 bg-red-700 bg-green-700"></span>
  )

  const handleAdminToggleChange = async (isOn) => {
    try {
      const body = { role: isOn ? "admin" : "cashier" }
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/${_id}`,
        body,
        getAuthOptions()
      )
      setHasUpdated(true)
    } catch (err) {
      console.warn(err)
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error)
        }
      }
    }
  }

  const handleVerifiedToggleChange = async (isOn) => {
    try {
      const body = { role: isOn ? "cashier" : "unverified" }
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/${_id}`,
        body,
        getAuthOptions()
      )
      setHasUpdated(true)
    } catch (err) {
      console.warn(err)
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error)
        }
      }
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/users/${_id}`,
        getAuthOptions()
      )
      setHasUpdated(true)
    } catch (err) {
      console.warn(err)
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error)
        }
      }
    }
  }

  const handleUpdateName = async () => {
    try {
      const body = { username: nameValue }
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/users/${_id}`,
        body,
        getAuthOptions()
      )
      setIsEditing(false)
    } catch (err) {
      console.warn(err)
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error)
        }
      }
    }
  }

  const nameButton = (
    <button
      type="button"
      onClick={() => setIsEditing(!isEditing)}
      className="flex justify-center items-center"
    >
      <span>{nameValue}</span>
      <span className="material-symbols-rounded ml-3">edit</span>
    </button>
  )

  // TODO: submit on enter, too
  const nameInput = (
    <div className="flex">
      <input
        className="bg-slate-300 rounded-md px-2 py-1 shadow-inner w-full"
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
      />
      <button
        type="button"
        onClick={handleUpdateName}
        className="flex justify-center items-center ml-1"
      >
        <span className="material-symbols-rounded">done</span>
      </button>
    </div>
  )

  const nameDisplay = isEditing ? nameInput : nameButton

  return (
    <div className={`${gridStyles}`}>
      {/* User icons and username */}
      <div className="flex justify-center items-center col-span-2">
        <div>
          <UserIcon isAdmin={role === "admin"} />
        </div>
        <div className="w-48">{nameDisplay}</div>
      </div>

      {/* Role (Admin?) */}
      <div className="flex justify-center items-center">
        <Toggle
          isOn={role === "admin"}
          label={"Enable Admin"}
          colorOn="red-700"
          colorOff="slate-700"
          isDisabled={role === "unverified"}
          onChange={handleAdminToggleChange}
        />
      </div>

      {/* Verified (Active?) */}
      <div className="flex justify-center items-center space-x-2">
        <Toggle
          isOn={role !== "unverified"}
          label={"Verify employee account"}
          colorOn="green-700"
          colorOff="slate-700"
          onChange={handleVerifiedToggleChange}
        />
        <VerifiedIcon isVerified={role !== "unverified"} />
      </div>
      <div className="flex justify-center items-center">
        <button
          className="bg-red-700 text-white py-1 px-3 rounded-md"
          onClick={() => handleDelete()}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

Employee.propTypes = {
  _id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  setHasUpdated: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  gridStyles: PropTypes.string.isRequired,
}
