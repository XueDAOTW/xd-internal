import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import z from "zod";
import { Role } from "@prisma/client";
import { useS3Upload } from "next-s3-upload";
import { Form, getMessageFromFieldErrors, useZodForm } from "../ui/Form";
import { Input } from "../ui/Input";
import Shimmer from "../ui/Shimmer";

export default function AddMembersModal() {
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [getRolesLoading, setGetRolesLoading] = useState(false);

  const { uploadToS3 } = useS3Upload();

  const form = useZodForm({
    schema: z.object({
      name: z.string().nonempty("Required"),
      email: z.string().nonempty("Required").email(),
      telegramUsername: z.string().nonempty("Required"),
      ethAddress: z
        .string()
        .nonempty("Required")
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid ETH address"),
      twitterUsername: z.string().optional(),
      location: z.string().optional(),
      hobbies: z.string().optional(),
      currentCompany: z.string().optional(),
      currentRole: z.string().optional(),
      imageFile: z.any(),
      roles: z.record(z.string(), z.boolean()),
    }),
    mode: "onBlur",
  });

  const onSubmit = async (data: any) => {
    setAddMemberLoading(true);
    try {
      const formValues = form.getValues();
      let image = null;
      if (formValues.imageFile.length > 0) {
        const { url } = await uploadToS3(formValues.imageFile[0]);
        image = url;
      }
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          ethAddress: formValues.ethAddress,
          telegramUsername: formValues.telegramUsername,
          twitterUsername: formValues.twitterUsername,
          location: formValues.location,
          hobbies: formValues.hobbies,
          currentCompany: formValues.currentCompany,
          currentRole: formValues.currentRole,
          image,
          roles: Object.keys(data.roles)
            .filter((roleId) => data.roles[roleId] === true)
            .map((roleId) => ({ id: roleId })),
        }),
      }).then((res) => res.json());

      if (response.data) {
        toast.success(`Member "${formValues.name}" added successfully.`);
        // TODO refresh list of members
        setShowModal(false);
      } else {
        toast.error(response.error ?? "Error adding member.");
      }
    } catch (error) {
      toast.error("Unknown error occurred.");
    }
    setAddMemberLoading(false);
  };

  // Only fetch roles when modal is opened for the first time
  useEffect(() => {
    const getRoles = async () => {
      setGetRolesLoading(true);
      try {
        const response = await fetch("/api/roles", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }).then((res) => res.json());

        if (response.data) {
          setRoles(response.data);
        } else {
          toast.error(response.error ?? "Error retrieving roles.");
        }
      } catch (error) {
        toast.error("Unknown error occurred.");
      }
      setGetRolesLoading(false);
    };
    if (showModal && roles.length === 0) {
      getRoles();
    }
  }, [showModal]);

  return (
    <>
      <label
        htmlFor="add-members-modal"
        className="btn-primary btn-sm btn text-xs font-normal"
      >
        Add
      </label>
      <input
        type="checkbox"
        id="add-members-modal"
        className="modal-toggle"
        onChange={(e) => {
          if (e.target.checked) {
            setShowModal(true);
          } else {
            setShowModal(false);
          }
          form.reset();
        }}
        checked={showModal}
      />
      <label
        htmlFor="add-members-modal"
        className="modal modal-bottom cursor-pointer sm:modal-middle"
      >
        <label className="modal-box relative" htmlFor="">
          <label
            htmlFor="add-members-modal"
            className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2 sm:hidden"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Add Member</h3>
          <p className="py-4">
            This adds a member to our directory. Current does not airdrop the
            seasonal membership NFT, so this should be done separately.
          </p>
          <Form
            form={form}
            onSubmit={onSubmit}
            onError={() =>
              toast.error("Unknown error occurred while submitting")
            }
            className="w-full"
          >
            <div className="form-control flex gap-y-2">
              <Input
                label="Name *"
                type="text"
                {...form.register("name")}
                placeholder="Vitalik Buterin"
                error={getMessageFromFieldErrors(form.formState.errors, "name")}
              />
              <Input
                label="Email *"
                type="text"
                {...form.register("email")}
                placeholder="vitalik@ethereum.org"
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "email",
                )}
              />
              <Input
                label="Telegram Username *"
                type="text"
                {...form.register("telegramUsername")}
                placeholder="vitalik (exact username without @)"
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "telegramUsername",
                )}
              />
              <Input
                label="ETH Address *"
                type="text"
                {...form.register("ethAddress")}
                placeholder="0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "ethAddress",
                )}
              />
              <Input
                label="Twitter Username"
                type="text"
                {...form.register("twitterUsername")}
                placeholder="vitalik (exact username without @)"
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "twitterUsername",
                )}
              />
              <Input
                label="Location"
                type="text"
                {...form.register("location")}
                placeholder="Taiwan,New York,Remote"
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "location",
                )}
              />
              <Input
                label="Hobbies"
                type="text"
                {...form.register("hobbies")}
                placeholder="music, nature, art, dancing..."
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "hobbies",
                )}
              />
              <Input
                label="Current Company"
                type="text"
                {...form.register("currentCompany")}
                placeholder="Bu Zhi DAO"
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "currentCompany",
                )}
              />
              <Input
                label="Current Role"
                type="text"
                {...form.register("currentRole")}
                placeholder="Founder"
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "currentRole",
                )}
              />
              <Input
                label="Profile Picture"
                type="file"
                {...form.register("imageFile")}
                error={getMessageFromFieldErrors(
                  form.formState.errors,
                  "imageFile",
                )}
              />
              <div>
                <label className="label">
                  <span className="label-text">Select Role(s)</span>
                </label>
                {getRolesLoading ? (
                  <Shimmer width="100%" height={16} />
                ) : (
                  <>
                    {roles.map((role) => (
                      <Input
                        key={role.id}
                        label={role.name}
                        type="checkbox"
                        {...form.register(`roles.${role.id}`)}
                        error={getMessageFromFieldErrors(
                          form.formState.errors,
                          `roles.${role.id}`,
                        )}
                      />
                    ))}
                  </>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={clsx(
                    "btn-primary btn w-full",
                    addMemberLoading &&
                      form.formState.isSubmitting &&
                      "loading",
                  )}
                >
                  Add Member
                </button>
              </div>
            </div>
          </Form>
        </label>
      </label>
    </>
  );
}
