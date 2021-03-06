// vim: expandtab:ts=4:sw=4
/*
 * Copyright 2015-2016 Carsten Klein
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {isInitializedPropertyDescriptor} from 'pingo-common/guards';
import {className} from 'pingo-common/utils';

import InjectionError from './exceptions';


/**
 * Asserts that the specified property descriptor does not define an
 * initializer.
 *
 * **DESIGN LIMITATION**
 * Properties with initializers will be bound when invoking the constructor
 * and cannot be late bound. This will cause errors in cases where the broker
 * was not fully initialized. As such, we cannot support injection here, even
 * with promises or similar mechanisms in place unless the broker itself is
 * a promise, but this is beyond the scope of this API.
 *
 * @protected
 * @param {InjectionDescriptorType} injectionDescriptor - the injection descriptor
 * @throws {InjectionError}
 * @returns {void}
 */
export function assertNotInitialized({target, attr, descriptor, ifaces})
{
    if (isInitializedPropertyDescriptor(descriptor))
    {
        throw new InjectionError(
            'unable to inject into initialized property'
            + ` "${attr}" of target "${className(target)}"`,
            {data:{target, attr, descriptor, ifaces}}
        );
    }
}


/**
 * Asserts that the user tries to inject a single interface only.
 *
 * @protected
 * @param {InjectionDescriptorType} injectionDescriptor - the injection descriptor
 * @throws {InjectionError}
 * @returns {void}
 */
export function assertSingleInterfaceOnly({target, attr, descriptor, ifaces})
{
    if (ifaces.length > 1)
    {
        throw new InjectionError(
            `single interface expected when injecting into property`
            + ` "${attr}" of target "${className(target)}"`,
            {data:{target, attr, descriptor, ifaces}}
        );
    }
}


/**
 * Asserts that the number of formal parameter of the method is equal to
 * or greater than the number of interfaces injected.
 *
 * @protected
 * @param {InjectionDescriptorType} injectionDescriptor - the injection descriptor
 * @throws {InjectionError}
 * @returns {void}
 */
export function assertFormalParametersMatch({target, attr, descriptor, ifaces})
{
    let injectionTarget = target;
    let targetName = 'constructor';
    if (descriptor && typeof descriptor.value == 'function')
    {
        injectionTarget = descriptor.value;
        targetName = attr;
    }

    if (injectionTarget.length < ifaces.length)
    {
        throw new InjectionError(
            'unable to inject more interfaces than there are formal parameters'
            + ` into "${targetName}" of target "$(className(target)}"`,
            {data:{target, attr, descriptor, ifaces}}
        );
    }
}

