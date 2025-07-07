# Determine executable suffix depending on OS
EXE_SUFFIX :=
ifeq ($(OS),Windows_NT)
	EXE_SUFFIX := .exe
endif

# Always work relative to this Makefile directory
MAKEFILE_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

# Paths relative to the Makefile directory (dist_scripts)
SCRIPT_FILE = start_server.py
EXE_NAME = talea_uhi
ICON_PATH = ../docs/images/talea.ico
DIST_DIR = ./bin
SITE_DIR = ../docs

# Main rule
.PHONY: all
all: build

# Build the executable with error checking
.PHONY: build
build:
	@echo "🔨 Building the executable $(EXE_NAME)$(EXE_SUFFIX) with PyInstaller..."
	cd $(MAKEFILE_DIR) && \
	pyinstaller --onefile --windowed --icon "$(ICON_PATH)" --name $(EXE_NAME) $(SCRIPT_FILE)
	cd $(MAKEFILE_DIR) && \
	echo "📦 Contents of dist/ after build:" && ls -l dist/
	cd $(MAKEFILE_DIR) && \
	if [ ! -f dist/$(EXE_NAME)$(EXE_SUFFIX) ]; then \
		echo "❌ Build failed: dist/$(EXE_NAME)$(EXE_SUFFIX) not found. Check PyInstaller output for errors."; \
		exit 1; \
	fi
	cd $(MAKEFILE_DIR) && \
	mkdir -p $(DIST_DIR)
	cd $(MAKEFILE_DIR) && \
	mv dist/$(EXE_NAME)$(EXE_SUFFIX) $(DIST_DIR)/
	cd $(MAKEFILE_DIR) && \
	cp $(DIST_DIR)/$(EXE_NAME)$(EXE_SUFFIX) ../
	cd $(MAKEFILE_DIR) && \
	echo "✅ Executable created at ../$(EXE_NAME)$(EXE_SUFFIX)"

# Clean temporary and build files
.PHONY: clean
clean:
	@echo "🧹 Cleaning up..."
	cd $(MAKEFILE_DIR) && \
	rm -rf build dist __pycache__ *.spec $(DIST_DIR) ../$(EXE_NAME) ../$(EXE_NAME).exe
	@echo "✅ Clean complete."

# Run the Python script directly for local testing
.PHONY: run
run:
	@echo "🚀 Starting server on port $(PORT)..."
	cd $(MAKEFILE_DIR) && \
	python $(SCRIPT_FILE) $(PORT)

