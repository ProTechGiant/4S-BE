# Set MySQL database credentials
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="Waqar123!@"
MYSQL_DATABASE="4STestDB"

# # Use a more secure method to pass the password to MySQL
# mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE" <<< "$MYSQL_PASSWORD"

# # Display the list of databases
# mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p -e "SHOW DATABASES" <<< "$MYSQL_PASSWORD"

# Use a more secure method to pass the password to MySQL
echo "$MYSQL_PASSWORD" | mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE"

# Display the list of databases
echo "$MYSQL_PASSWORD" | mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER -p -e "SHOW DATABASES"