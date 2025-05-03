#!/bin/bash
set -e

# Update packages
echo "Updating packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker dependencies
echo "Installing Docker dependencies..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
echo "Adding Docker GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Set up the Docker repository
echo "Setting up Docker repository..."
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Update the package database with Docker packages
echo "Updating package database..."
sudo apt-get update -y

# Install Docker
echo "Installing Docker..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
echo "Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add the current user to the Docker group
echo "Adding user to Docker group..."
sudo usermod -aG docker $USER
echo "You may need to log out and back in for Docker group membership to take effect"

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
echo "Verifying installations..."
docker --version
docker-compose --version

echo "Setup complete! Docker is now installed and ready to use." 