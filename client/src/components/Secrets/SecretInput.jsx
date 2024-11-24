import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function SecretInput() {
  const { fetchListOfSecrets, user, selectedSecret, setSelectedSecret } =
    useContext(GlobalContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  async function handleSaveSecret(content) {
    const secret = {
      title: content.title,
      description: content.description,
      userId: user._id,
    };

    try {
      const response = await fetch("/api/secrets/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(secret),
      });
      if (response.ok) {
        reset({
          title: "",
          description: "",
        });
        fetchListOfSecrets();
        toast.success("Your Secret Added");
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function populateFields() {
    if (selectedSecret) {
      setValue("title", selectedSecret.title);
      setValue("description", selectedSecret.description);
    }
  }

  async function handleEdit(content) {
    try {
      const response = await fetch(
        `/api/secrets/update/${selectedSecret._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: content.title,
            description: content.description,
          }),
        }
      );

      if (response.ok) {
        fetchListOfSecrets();
        toast.success("Secret Edited");
        reset({
          title: "",
          description: "",
        });
        setSelectedSecret(null);
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    populateFields();
  }, [selectedSecret]);

  return (
    <div className="container px-4 md:px-6">
      <div className="space-y-2 text-center ">
        <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
          Hi, {user.username}
        </h1>
        <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
          Share Your Secret
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
          Share your secret with us. Your identity will remain anonymous.
        </p>
      </div>
      <form
        className="flex flex-col items-center justify-center mt-5 space-y-4"
        noValidate
        onSubmit={handleSubmit((data, e) => {
          e.preventDefault();
          selectedSecret ? handleEdit(data) : handleSaveSecret(data);
        })}
      >
        <div className="flex flex-col w-full max-w-md gap-2">
          <div>
            <input
              placeholder="Title of your secret..."
              type="text"
              id="title"
              {...register("title", {
                required: "Secret Title is required",
              })}
            />
            {errors.title && (
              <p className="m-2 text-red-500 text-start">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <textarea
              placeholder="Type your secret here..."
              id="description"
              {...register("description", {
                required: "Secret Description is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="mx-2 text-red-500 text-start">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            className="w-full mt-2 bg-[#18181B] hover:bg-[#2c2c31] text-white py-2 rounded-md"
            type="submit"
          >
            Share Secret
          </button>
        </div>
      </form>
    </div>
  );
}
