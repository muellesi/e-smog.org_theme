#!/bin/bash
mkdir -p build &&
mkdir -p build/gems &&
gem build theme-e-smog.gemspec &&
mv *.gem build/gems &&
cd build &&
gem generate_index