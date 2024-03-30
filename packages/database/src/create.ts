import { createClient } from ".";

const client = createClient();

async function main() {
  const fs = require("fs");
  const path = require("path");

  async function readAndCreateUsers() {
    const membersFilePath = path.join(__dirname, "members.csv");
    const membersData = fs.readFileSync(membersFilePath, { encoding: "utf-8" });
    const members = membersData.split("\r\n").slice(1); // Skip header row

    for (const member of members) {
      if (member) {
        // Check if the row is not empty
        let [
          name,
          email,
          ,
          telegramUsername,
          ethAddress,
          location,
          hobbies,
          currentCompany,
          currentRole,
        ] = member.split(",");
        telegramUsername = telegramUsername.startsWith("@")
          ? telegramUsername.substring(1)
          : telegramUsername;
        const user = {
          name,
          email,
          telegramUsername,
          ethAddress,
          location,
          hobbies,
          currentCompany,
          currentRole,
        };
        try {
          await client.user.create({
            data: user,
          });
          console.log(`User ${name} created successfully.`);
        } catch (error) {
          console.error(`Failed to create user ${name}:`, error);
        }
      }
    }
  }

  await readAndCreateUsers();
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await client.$disconnect();
    process.exit(1);
  });
