
require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# This is required to make install_modules_dependencies available
require_relative 'node_modules/react-native/scripts/react_native_pods'

Pod::Spec.new do |s|
  s.name         = "intercom-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "15.0" }
  s.source       = { :git => "https://github.com/intercom/intercom-react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
  s.resource_bundles = { 'IntercomFramework' => ['ios/assets/*'] }

  s.pod_target_xcconfig = { "DEFINES_MODULE" => "YES" }

  install_modules_dependencies(s)
  s.dependency "Intercom", '~> 18.7.3'
end
