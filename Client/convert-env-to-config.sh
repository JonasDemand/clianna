#!/bin/bash

# Read the .env.local file
while IFS= read -r line; do
  # Skip comments and empty lines
  if [[ $line == \#* ]] || [[ -z $line ]]; then
    continue
  fi

  # Extract key and value from each line
  key=$(echo "$line" | awk -F '=' '{print $1}')
  value=$(echo "$line" | awk -F '=' '{print $2}')

  # Append the converted line to the config.ts file
  echo "  $key: process.env.$key ?? \"$value\"," >> temp-config.ts
done < .env.example

# Add the export statement to the beginning of the config.ts file
printf '// THIS IS AN AUTOGENERATE SCRIPT! Use "npm run convert-config" to re-create\nexport const environment = {\n' | cat - temp-config.ts > utils/config.ts

# Add the closing bracket to the end of the config.ts file
echo '};' >> utils/config.ts

# Remove the temporary file
rm temp-config.ts
