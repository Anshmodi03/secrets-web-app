import { useContext } from "react";
import { GlobalContext } from "../../context";
import { IoTrashBin } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

export default function SecretList() {
  const {
    secretList,
    pending,
    user,
    fetchListOfSecrets,
    selectedSecret,
    setSelectedSecret,
  } = useContext(GlobalContext);

  async function handleDelete(id) {
    if (selectedSecret) return toast.warning("Editing Secret");
    try {
      const response = await fetch(`/api/secrets/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        fetchListOfSecrets();
        toast.success("Secret Deleted");
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const sortedSecrets = [...secretList].sort((a, b) =>
    a.userId === user._id ? -1 : b.userId === user._id ? 1 : 0
  );

  return (
    <div className="container px-4 m-auto md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter md:text-5xl">
            Secrets Shared
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
            Read the secrets shared by others. Remember, respect everyone's
            privacy.
          </p>
        </div>
      </div>
      <div className="grid w-full max-w-2xl gap-4 m-auto">
        {sortedSecrets && !sortedSecrets.length && (
          <p className="mt-4 text-center">No Secrets available</p>
        )}
        {sortedSecrets && sortedSecrets.length && pending ? (
          <p className="mt-4 text-center">Loading Secrets Please wait...</p>
        ) : (
          <div className="p-4">
            {sortedSecrets.map((secret) => (
              <div
                key={secret._id}
                className="px-10 py-5 m-4 bg-white shadow-md hover:shadow-lg "
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold lg:text-2xl">
                      Anonymous User
                    </h3>
                    <h2 className="text-xl font-bold text-gray-700 ">
                      {secret.title}
                    </h2>
                  </div>
                  {user._id === secret.userId ? (
                    <div className="flex gap-4 text-2xl">
                      <FaEdit
                        className="cursor-pointer hover:scale-125"
                        onClick={() => setSelectedSecret(secret)}
                      />
                      <IoTrashBin
                        className="cursor-pointer hover:scale-125"
                        onClick={() => handleDelete(secret._id)}
                      />
                    </div>
                  ) : null}
                </div>
                <p className="mt-2 text-gray-600 ">{secret.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
